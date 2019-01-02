import { ErrorHandler } from "src/utils/rest/rest";

export default class Action {
    run: (errorHandler: ErrorHandler) => Promise<any>;
}