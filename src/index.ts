import {da, faker} from "@faker-js/faker";
import {Question, QuestionResponse, QuestionType, TypeForm} from "./types"

/**
 * @constructor
 */
export default class KamApi {
    private readonly DEV: boolean
    private readonly baseUrl: string
    private readonly mock: boolean
    private readonly apiKey: string

    /**
     *
     * This class provides useful functions for talking to the `kam-backend`.
     *
     * `devMode` sets the `baseUrl` to `localhost`. Set this to `true` when testing locally with the `kam-backend`
     * also running in the background.
     *
     *
     * `apiKey` is the `aKey` that is passed with the `header` to the server.
     *
     * Passing `true` to `mock` will enable 'mock server' mode. Essentially, the data returned will be
     * fake and the API will not try to communicate with the backend server. This is optimal for UI testing
     * where relying on an 'actual' server may cause flaky tests.
     * Setting `mock` to true makes `devMode` and `apiKey` redundant.
     *
     *
     *
     *
     * @summary Provides functions to access the KAM backend.
     * @param devMode Loads the API class in `devMode`.
     * @param mock Loads the API class in `mock` mode
     * @param apiKey The API key when calling the server.
     */
    constructor(devMode: boolean, mock: boolean, apiKey: string) {
        this.DEV = devMode
        this.mock = mock
        this.apiKey = apiKey
        this.baseUrl = this.DEV ? "http://localhost:3328" : "https://kam-backend.insektionen.se"
    }

    /**
     *
     * When launched in `devMode`, this function will try to communicate with `localhost`.
     * If `kam-backend` is not running on the backend, this function will fall back to `mock` mode.
     *
     * Enabling `mock` mode (by passing `mock: true` in the class constructor) will skip talking to the
     * server and generate and return fake data. This is optimal when running UI tests on the front-end.
     *
     * @summary Returns value from the `form/find` route.
     * @returns A list of forms with the `TypeForm` type.
     * @param formId `id` of the form to search for
     */
    async getForms(formId: string) {
        if (this.mock) return getMockForm(formId)
        else {
            try {
                return await fetchFormFromServer(this.baseUrl, formId, this.apiKey)
            } catch (e) {
                console.log(e)
            }
        }
    }

    /**
     * Send a response to `form/respond` route.
     *
     * @param data.questionResponses the response to the form
     * @param data.formId `id` of the form that the client is responding to.
     * @returns `true` if the request is successful.
     */
    async respondForm(data: {questionResponses: QuestionResponse[], formId: string}) {
        try {
            const requestHeaders = new Headers()
            requestHeaders.set("Content-Type", "application/json")
            let res = await fetch("/", {
                method: "PUT",
                body: JSON.stringify(data),
                headers: requestHeaders
            })
            return res.status == 200
        } catch (e) {
            console.log(e)
            return false
        }
    }
}

/**
 * Returns a list consisting of 4 questions, one of each `QuestionType`.
 * @param formId Don't care in this case. Whatever you provide here will be returned back to the user.
 */
function getMockForm(formId: string): TypeForm {

    let questions: Question[] = [
        {
            id: faker.string.uuid(),
            prompt: faker.git.commitMessage(),
            description: faker.git.commitMessage(),
            formId: formId,
            type: QuestionType.long,
            option: [],
            required: false
        },
        {
            id: faker.string.uuid(),
            prompt: faker.git.commitMessage(),
            description: faker.git.commitMessage(),
            formId: formId,
            type: QuestionType.short,
            option: [],
            required: true
        },
        {
            id: faker.string.uuid(),
            prompt: faker.git.commitMessage(),
            description: faker.git.commitMessage(),
            formId: formId,
            type: QuestionType.multi,
            option: [
                {
                    id: "1",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "2",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "3",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "4",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                }
            ],
            required: true
        },
        {
            id: faker.string.uuid(),
            prompt: faker.git.commitMessage(),
            description: faker.git.commitMessage(),
            formId: formId,
            type: QuestionType.single,
            option: [
                {
                    id: "1",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "2",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "3",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                },
                {
                    id: "4",
                    title: faker.person.jobTitle(),
                    subtitle: faker.database.column()
                }
            ],
            required: true
        }
    ]


    return {
        id: formId,
        name: faker.git.commitMessage(),
        createdAt: faker.date.anytime().toISOString(),
        stillAccepting: true,
        questions: questions
    }
}

/**
 * Sends a `GET` request to the server and returns the JSON body.
 *
 * @summary This function does the actual fetchy fetchy.
 * @param baseUrl The address of the server. This can change between `localhost` or `kam-backend.insektionen.se`.
 * @param formId The `id` of the form to search for.
 * @param apiKey The `aKey` that must be attached to the header. This is passed on from the client-side codebase.
 *
 * @throws Error umm...wrap in a `try...catch` block.
 */
async function fetchFormFromServer(baseUrl: string, formId: string, apiKey: string): Promise<TypeForm> {
    let fetchUrl  = baseUrl + `/form/find?formId=${formId}`

    let result = await fetch(fetchUrl, {
        method: "GET",
        headers: {
            "aKey": apiKey
        }
    })

    return (await result.json()) as TypeForm

}