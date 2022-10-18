import {
  AuthTabLink,
  CredentialsAuthForm,
  MagicAuthForm,
  OAuthButton,
  UserRegistrationForm,
} from '@/components';
import {
  Container,
  Divider,
  HStack,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getCsrfToken, getProviders, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface AuthPageProps {
  providers: {
    [key: string]: {
      callbackUrl: string;
      id: string;
      name: string;
      signinUrl: string;
      type: string;
    };
  } | null;
  isAuth: boolean;
  csrfToken?: string | undefined;
}
type SignView = 'magic' | 'credentials' | 'oauth' | 'register';
const AuthPage: React.FC<AuthPageProps> = ({
  providers,
  csrfToken,
  isAuth,
}): JSX.Element => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [signInView, setSignInView] = useState<SignView>('magic');

  const { asPath } = router;


  // routing booleans
  const isMagicAuth = signInView === 'magic';
  const isCredentialAuth = signInView === 'credentials';
  const isOAuth = signInView === 'oauth';
  const isSigninRoute = isMagicAuth || isCredentialAuth || isOAuth;

  // style
  const shadow = colorMode === 'light' ? 'sm' : 'md-dark';

  return (
    // <PageLayout title={asPath} type="default">
      <Container w="100%" h="100%" mt="64">
        <VStack
          maxW="md"
          w="full"
          px={8}
          pb={8}
          boxShadow={shadow}
          rounded="md"
          gap={3}
        >
          <HStack as="ul" justify="space-between" w="full" pt={12} pb={4}>
            {/* <AuthTabLink to="magic" providerName="Passwordless" /> */}
            {/* <AuthTabLink to="credentials" providerName="Email" /> */}
            {/* <AuthTabLink to="oauth" providerName="OAuth" /> */}
          </HStack>
          <Divider
            position="relative"
            color="transparent"
            shadow={colorMode === 'light' ? 'md' : 'dark-md'}
          />
          {/* {!isSigninRoute && isRegister && !isAuth && <UserRegistrationForm />} */}
          {/* {isSigninRoute && !isAuth && (
            <>
              {isMagicAuth && (
                <MagicAuthForm
                  csrfToken={csrfToken || ''}
                  providerId={providers?.email?.id}
                />
              )}
              {isCredentialAuth && <CredentialsAuthForm />}
              {isOAuth && (
                <VStack>
                  {providers &&
                    Object.values(providers)?.map((provider) => {
                      if (
                        provider?.id !== 'credentials' &&
                        provider?.id !== 'email'
                      ) {
                        return (
                          <OAuthButton key={provider?.id} provider={provider} />
                        );
                      }
                    })}
                </VStack>
              )}
            </>
          )} */}
        </VStack>
      </Container>
    // </PageLayout>
  );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps<AuthPageProps> = async (
  context
) => {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/?success=You are already signed in.' },
      props: {
        providers: null,
        csrfToken: undefined,
        isAuth: false,
      },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(),
      isAuth: !!session,
    },
  };
};
