import IEnvironmentInformation from 'src/utils/authentication/IEnvironmentInformation';
import {Environment} from 'src/utils/environmentVariables';

class EnvironmentDetection {
    
    public detectEnvironment(): IEnvironmentInformation {
        const environment = process.env.SEKOIA_ENV;
        switch(environment) {
            case Environment.local.toString():
                return {
                    BaseAuthUrl: 'https://auth-dev.sekoia.dk/',
                    ClientId: 'OneCare-localhost',
                    Scope: 'urn:sekoia:development',
                    }
            case Environment.dev.toString():
                return {
                    BaseAuthUrl: 'https://auth-dev.sekoia.dk/',
                    ClientId: 'onecaredev',
                    Scope: 'urn:sekoia:development',
                    }          
            case Environment.preprod.toString():
                return {
                    BaseAuthUrl: 'https://auth-preprod.sekoia.dk/',
                    ClientId: 'onecarepreprod',
                    Scope: 'urn:sekoia:preprod',
                    }
            case Environment.prod.toString():
                return {
                    BaseAuthUrl: 'https://auth.sekoia.dk/',
                    ClientId: 'onecareprod',
                    Scope: 'urn:sekoia:production',
                    }
            default:
                throw('Unknown environment.');
        }

    }
}

export default EnvironmentDetection;