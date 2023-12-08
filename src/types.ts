export type Question = {
    /**
     * This is referred to as `questionId` in some places.
     */
    id: string,
    prompt: string,
    description: string,
    type: QuestionType,
    option: Option[],
    required: boolean,
    default?: string,
    placeholder?: string,
    formId: string
}

/**
 * JSON body type that is received from `/form/find`
 */
export type TypeForm = {
    /**
     * This is referred to as `formId` in some places.
     */
    id: string,
    name: string,
    createdAt: string,
    stillAccepting: boolean,
    questions: Question[]
}

/**
 * JSON body type that is to be sent to `form/respond`
 */
export type FormResponse = {
    formId: string,
    questionResponses: QuestionResponse[]
}

/**
 * JSON type for a response to a particular question when sending data to `form/respond/`
 */
export type QuestionResponse = {
    id?: string,
    questionId: string,
    value: string
}

/**
 * JSON type for an option that is received with the `Question` type when querying for forms.
 */
export type Option = {
    id: string,
    title: string,
    subtitle: string
}

/**
 * The various questions types that we can get from the API.
 */
export enum QuestionType {
    multi = "MultiChoice",
    single = "SingleChoice",
    short = "ShortAnswer",
    long = "LongAnswer",
    singleWithImage = "SingleChoiceWithImage",
    multiWithImage = "MultiChoiceWithImage"
}
