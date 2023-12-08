"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionType = void 0;
/**
 * The various questions types that we can get from the API.
 */
var QuestionType;
(function (QuestionType) {
    QuestionType["multi"] = "MultiChoice";
    QuestionType["single"] = "SingleChoice";
    QuestionType["short"] = "ShortAnswer";
    QuestionType["long"] = "LongAnswer";
    QuestionType["singleWithImage"] = "SingleChoiceWithImage";
    QuestionType["multiWithImage"] = "MultiChoiceWithImage";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
