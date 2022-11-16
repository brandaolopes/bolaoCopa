import { Text, HStack, Box } from 'native-base';
import { CaretLeft, Export, SignOut } from 'phosphor-react-native';

import { ButtonIcon } from './ButtonIcon';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  showLogoutButton?: boolean;
  onShare?: () => void;
  signOut?: () => void;
}

export function Header({ title, showBackButton = false, showShareButton = false, showLogoutButton = false, onShare, signOut }: Props) {
  const EmptyBoxSpace = () => (<Box w={6} h={6} />);

  const navigation = useNavigation();

  return (
    <HStack w="full" h={24} bgColor="gray.800" alignItems="flex-end" pb={5} px={5}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {
          showBackButton
            ? <ButtonIcon icon={CaretLeft} onPress={() => navigation.navigate('pools')}/>
            : <EmptyBoxSpace />
        }

        <Text color="white" fontFamily="medium" fontSize="md" textAlign="center">
          {title}
        </Text>

        {
          showShareButton
            ?
            <ButtonIcon icon={Export} onPress={onShare}/>
            :
            ''
        }

        {
          showLogoutButton ?
          <ButtonIcon icon={SignOut} onPress={signOut}/> :
          ''
        }
      </HStack>
    </HStack>
  );
}