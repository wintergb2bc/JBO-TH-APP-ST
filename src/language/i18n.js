import I18n,{ getLanguages } from 'react-native-i18n';
import zh from './zh';


   //默认
    I18n.defaultLocale = 'zh';

    I18n.fallbacks = true;
    //支持转换的语言
    I18n.translations = {
		  	zh
        
    };
    export {
        I18n,
        getLanguages
    }