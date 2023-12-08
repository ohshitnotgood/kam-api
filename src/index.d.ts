import {QuestionResponse, TypeForm} from "./types";

export default class KamApi {
    constructor(devMode: boolean, mock: boolean, apiKey: boolean)
    getForms(formId: string): Promise<TypeForm>
    respondForm(data: {questionResponses: QuestionResponse[], formId: string}): void
}