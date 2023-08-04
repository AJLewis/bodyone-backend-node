interface OpenAiCompletionModels {
    readonly textdavinci003 : string;
    readonly textdavinci002 : string;
    readonly textcurie001 : string;
    readonly textbabbage001 : string;
    readonly textada001 : string;
}

interface OpenAiChatModels {
    readonly gpt4 : string;
    readonly gpt40314 : string;
    readonly gpt432k : string;
    readonly gpt432k0314 : string;
    readonly gpt35turbo : string;
    readonly gpt35turbo0301 : string;
}

export const OpenAiCompletionModels: OpenAiCompletionModels = {
    textdavinci003 : 'text-davinci-003',
    textdavinci002 : 'text-davinci-002',
    textcurie001 : 'text-curie-001',
    textbabbage001 : 'text-babbage-001',
    textada001 : 'text-ada-001'
}

export const OpenAiChatModels: OpenAiChatModels = {
    gpt4 : 'gpt-4',
    gpt40314 : 'gpt-4-0314',
    gpt432k : 'gpt-4-32k',
    gpt432k0314 : 'gpt-4-32k-0314',
    gpt35turbo : 'gpt-3.5-turbo',
    gpt35turbo0301 : 'gpt-3.5-turbo-0301'
}