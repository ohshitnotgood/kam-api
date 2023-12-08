"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const types_1 = require("./types");
/**
 * @constructor
 */
class KamApi {
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
    constructor(devMode, mock, apiKey) {
        this.DEV = devMode;
        this.mock = mock;
        this.apiKey = apiKey;
        this.baseUrl = this.DEV ? "http://localhost:3328" : "https://kam-backend.insektionen.se";
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
    getForms(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mock)
                return getMockForm(formId);
            else {
                try {
                    return yield fetchFormFromServer(this.baseUrl, formId, this.apiKey);
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
    /**
     * Send a response to `form/respond` route.
     *
     * @param data.questionResponses the response to the form
     * @param data.formId `id` of the form that the client is responding to.
     * @returns `true` if the request is successful.
     */
    respondForm(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestHeaders = new Headers();
                requestHeaders.set("Content-Type", "application/json");
                let res = yield fetch("/", {
                    method: "PUT",
                    body: JSON.stringify(data),
                    headers: requestHeaders
                });
                return res.status == 200;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.default = KamApi;
/**
 * Returns a list consisting of 4 questions, one of each `QuestionType`.
 * @param formId Don't care in this case. Whatever you provide here will be returned back to the user.
 */
function getMockForm(formId) {
    let questions = [
        {
            id: faker_1.faker.string.uuid(),
            prompt: faker_1.faker.git.commitMessage(),
            description: faker_1.faker.git.commitMessage(),
            formId: formId,
            type: types_1.QuestionType.long,
            option: [],
            required: false
        },
        {
            id: faker_1.faker.string.uuid(),
            prompt: faker_1.faker.git.commitMessage(),
            description: faker_1.faker.git.commitMessage(),
            formId: formId,
            type: types_1.QuestionType.short,
            option: [],
            required: true
        },
        {
            id: faker_1.faker.string.uuid(),
            prompt: faker_1.faker.git.commitMessage(),
            description: faker_1.faker.git.commitMessage(),
            formId: formId,
            type: types_1.QuestionType.multi,
            option: [
                {
                    id: "1",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "2",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "3",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "4",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                }
            ],
            required: true
        },
        {
            id: faker_1.faker.string.uuid(),
            prompt: faker_1.faker.git.commitMessage(),
            description: faker_1.faker.git.commitMessage(),
            formId: formId,
            type: types_1.QuestionType.single,
            option: [
                {
                    id: "1",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "2",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "3",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                },
                {
                    id: "4",
                    title: faker_1.faker.person.jobTitle(),
                    subtitle: faker_1.faker.database.column()
                }
            ],
            required: true
        }
    ];
    return {
        id: formId,
        name: faker_1.faker.git.commitMessage(),
        createdAt: faker_1.faker.date.anytime().toISOString(),
        stillAccepting: true,
        questions: questions
    };
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
function fetchFormFromServer(baseUrl, formId, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let fetchUrl = baseUrl + `/form/find?formId=${formId}`;
        let result = yield fetch(fetchUrl, {
            method: "GET",
            headers: {
                "aKey": apiKey
            }
        });
        return (yield result.json());
    });
}
