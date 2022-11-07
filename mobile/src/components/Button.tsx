import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';

interface ButtonProps extends IButtonProps{
    title: string,
    type?: 'PRIMARY' | 'SECONDARY'
}

export function Button({ title, type = 'PRIMARY', ...rest }: ButtonProps) {
    return (
        <ButtonNativeBase 
            width="full"
            height={14}
            rounded="sm"
            fontSize="md"
            textTransform="uppercase"
            bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
            _pressed={{
                bg: type === 'SECONDARY' ? 'red.400' : 'yellow.600'
            }}
            _loading={{
                _spinner: { color: 'black'}
            }}
            {...rest}>
            <Text
                fontSize="sm"
                textTransform="uppercase"
                fontFamily="heading"
                color={type === 'SECONDARY' ? 'white' : 'black'}>
                {title}</Text>
        </ButtonNativeBase>
    );
}