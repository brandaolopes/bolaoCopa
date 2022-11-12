import { Center, Text, Image, Icon } from 'native-base';
import { Button } from '../components/Button';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';


export function SignIn() {
    
    const logo = require('../assets/logo.png');

    const { signIn, isUserLoading } = useAuth();

    return (
        <Center flex={1} bgColor="gray.900" padding={7}>
            <Image source={logo} alt="logo da aplicação" />
            <Button 
                title="Entrar com o Google"
                type="SECONDARY"
                leftIcon={<Icon as={Fontisto} color="white" name="google" size="md"/>}
                marginTop={12}
                onPress={signIn}
                isLoading={isUserLoading}
                _loading={{ _spinner: { color: 'white' }}} 
            />

            <Text color="white" textAlign="center" marginTop={4}>
                Não utilizamos nada além do seu endereço{'\n'} de email para a criação da sua conta
            </Text>
                
                
        </Center>
    )
}