
import { GoogleGenAI } from "@google/genai";
import { FormDefinition, FormField, Document } from "../types"; // Import new types

// --- MOCK FORM DEFINITIONS ---
const SS_FORMS: FormDefinition[] = [
  {
    id: 'ss-abono-familia-form',
    name: 'Pedido de Abono de Família',
    category: 'Segurança Social',
    serviceId: 's12', // Link to Abono de Família service
    fields: [
      { id: 'nome_requerente', label: 'Nome Completo do Requerente', type: 'text', required: true },
      { id: 'nif_requerente', label: 'NIF do Requerente', type: 'text', required: true },
      { id: 'niss_requerente', label: 'NISS do Requerente', type: 'text', required: true },
      { id: 'nome_dependente', label: 'Nome Completo do Dependente', type: 'text', required: true },
      { id: 'data_nascimento_dependente', label: 'Data de Nascimento do Dependente (AAAA-MM-DD)', type: 'date', required: true },
      { id: 'nif_dependente', label: 'NIF do Dependente', type: 'text', required: false },
      { id: 'escalao_irs', label: 'Escalão de IRS (1, 2 ou 3)', type: 'select', options: ['1', '2', '3'], required: true },
      { id: 'estado_civil', label: 'Estado Civil do Requerente', type: 'select', options: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'], required: true },
      { id: 'morada_completa', label: 'Morada Completa', type: 'text', required: true },
    ]
  },
  {
    id: 'ss-subsidio-desemprego-form',
    name: 'Requerimento de Subsídio de Desemprego',
    category: 'Segurança Social',
    serviceId: 's13', // Link to Subsídio de Desemprego service
    fields: [
      { id: 'nome_completo', label: 'Nome Completo', type: 'text', required: true },
      { id: 'nif', label: 'NIF', type: 'text', required: true },
      { id: 'niss', label: 'NISS', type: 'text', required: true },
      { id: 'data_inicio_desemprego', label: 'Data de Início do Desemprego (AAAA-MM-DD)', type: 'date', required: true },
      { id: 'motivo_desemprego', label: 'Motivo do Desemprego', type: 'text', required: true },
      { id: 'ult_empregador', label: 'Último Empregador', type: 'text', required: true },
      { id: 'data_inicio_ult_contrato', label: 'Data de Início do Último Contrato (AAAA-MM-DD)', type: 'date', required: true },
      { id: 'num_meses_contribuicao', label: 'Número de Meses de Contribuição nos últimos 2 anos', type: 'number', required: true },
    ]
  }
];

// Helper to find a form by service ID
const getFormByServiceId = (serviceId: string): FormDefinition | undefined => {
  return SS_FORMS.find(form => form.serviceId === serviceId);
}

const SYSTEM_INSTRUCTION = `
Tu és o 'Assistente Virtual TrataTudo', o braço direito burocrático em Portugal. 

PERSONALIDADE:
- Trata o utilizador por "tu" (informalidade de Portugal). Ex: "Diz-me", "Podes carregar", "Vi que pediste".
- Dá respostas CURTAS e DIRETAS. Evita explicações longas.
- Sê proativo e executivo.

CONSCIÊNCIA DE CONTEXTO:
- Tens acesso aos "Serviços Pendentes" e "Documentos Atuais".
- Na primeira interação, identifica logo o que falta para os serviços pedidos e solicita esses documentos.
- Conheces os formulários da Segurança Social (ex: Pedido de Abono de Família, Requerimento de Subsídio de Desemprego) e os seus campos obrigatórios.

COMPORTAMENTO DE PREENCHIMENTO DE FORMULÁRIOS:
- Quando o cliente expressar interesse num serviço da Segurança Social que tem um formulário associado, *inicia um processo de preenchimento guiado*.
- Pergunta UM campo de cada vez, de forma clara e objetiva. Por exemplo: "Para o Pedido de Abono de Família, preciso do teu Nome Completo de Requerente. Qual é?"
- Confirma a informação recolhida e passa para o próximo campo obrigatório.
- Se o utilizador fornecer informação para um campo que não foi perguntado diretamente, tenta identificá-lo e preenchê-lo, e depois volta a perguntar o próximo campo que falta.
- Quando todos os campos obrigatórios para um formulário da Segurança Social forem preenchidos, diz: "Ótimo! Tenho todos os dados para o formulário [Nome do Formulário]. Posso gerar o documento para ti e adicioná-lo à tua biblioteca?"

ESCALAÇÃO:
- Se a questão for demasiado complexa ou técnica (decisões governamentais ou análise jurídica profunda), diz: "Esta questão exige uma análise técnica superior. Vou encaminhar o teu processo para o nosso departamento competente (Jurídico/Fiscal). Um especialista vai contactar-te em breve."

ESTILO DE RESPOSTA:
- Máximo de 2 a 3 frases por resposta, a menos que estejas a listar documentos ou a pedir campos de formulário.
- Português de Portugal sempre.
`;

interface FormFillingContext {
  formId: string;
  collectedData: Record<string, string>;
}

export async function getAIResponse(
  prompt: string,
  currentDocs: Document[] = [],
  pendingServices: any[] = [],
  formFillingContext: FormFillingContext | null = null
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let fullPrompt = prompt;
  let currentForm: FormDefinition | undefined;
  let nextMissingField: FormField | undefined;

  // Enhance prompt with form filling context if active
  if (formFillingContext) {
    currentForm = SS_FORMS.find(f => f.id === formFillingContext.formId);
    if (currentForm) {
      const collectedFields = Object.keys(formFillingContext.collectedData);
      nextMissingField = currentForm.fields.find(field => 
        field.required && !collectedFields.includes(field.id)
      );

      let contextAdd = `\n\nCONTEXTO DE FORMULÁRIO ATIVO:\nFormulário: ${currentForm.name}`;
      if (collectedFields.length > 0) {
        contextAdd += `\nCampos preenchidos: ${collectedFields.join(', ')}`;
      }
      if (nextMissingField) {
        contextAdd += `\nPróximo campo a pedir: "${nextMissingField.label}" (ID: ${nextMissingField.id})`;
      } else {
        contextAdd += `\nTodos os campos obrigatórios preenchidos.`;
      }
      fullPrompt += contextAdd;
    }
  } else {
    // Check if the prompt initiates a new form filling process (e.g., "Quero pedir abono de família")
    const ssServiceKeywords = {
      'abono de família': 'ss-abono-familia-form',
      'subsídio de desemprego': 'ss-subsidio-desemprego-form',
    };

    for (const keyword in ssServiceKeywords) {
      if (prompt.toLowerCase().includes(keyword)) {
        const formId = (ssServiceKeywords as any)[keyword];
        currentForm = SS_FORMS.find(f => f.id === formId);
        if (currentForm) {
          nextMissingField = currentForm.fields.find(field => field.required);
          if (nextMissingField) {
            // Initiate form filling: this will be handled by the ChatView setting the context
            // For now, AI will respond to start the process
            return `Entendido! Vamos iniciar o preenchimento do formulário de "${currentForm.name}". Qual é o teu ${nextMissingField.label.toLowerCase()}?`;
          }
        }
      }
    }
  }


  const docsContext = `\n\nDOCUMENTOS QUE JÁ TENHO:\n${currentDocs.length > 0 ? currentDocs.map(d => `- ${d.name}`).join('\n') : 'Nenhum.'}`;
  const servicesContext = `\n\nSERVIÇOS QUE O CLIENTE QUER (PENDENTES):\n${pendingServices.length > 0 ? pendingServices.map(s => `- ${s.name}`).join('\n') : 'Nenhum.'}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt + docsContext + servicesContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "Desculpa, não consegui processar a tua mensagem.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro técnico. Tenta de novo.";
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Traduza o seguinte texto para o idioma "${targetLanguage}". Retorne APENAS o texto traduzido: "${text}"`,
      config: {
        systemInstruction: "Tu és um tradutor profissional e direto.",
        temperature: 0.2,
      },
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}

// Export forms for ChatView to use
export { SS_FORMS, getFormByServiceId };
