import { Observable } from "rx";
import { Dictionary } from "ninjagoat";
import { inject, injectable } from "inversify";
import ITranslationsRunner from "./ITranslationsRunner";
import ILanguageRetriever from "./retrievers/ILanguageRetriever";
import ITranslationsLoader from "./retrievers/ITranslationsLoader";
import ITranslationsConfig from "./ITranslationsConfig";

export type TranslationsModel = { language: string; translations: Dictionary<string> }

@injectable()
class TranslationsRunner implements ITranslationsRunner {
    private notifications: Observable<TranslationsModel>;

    constructor(@inject("ILanguageRetriever") private languageRetriever: ILanguageRetriever,
                @inject("ITranslationsLoader") private translationsLoader: ITranslationsLoader,
                @inject("ITranslationsConfig") config: ITranslationsConfig) {
        this.notifications = this.languageRetriever.retrieve()
            .startWith(config.language)
            .filter(language => !!language)
            .flatMap(lang => this.translationsLoader.load(lang).then(translations => ({ language: lang, translations: translations })))
            .shareReplay(1);
    }

    run(): Observable<TranslationsModel> {
        return this.notifications;
    }
}

export default TranslationsRunner;
