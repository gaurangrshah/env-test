import { credentialsLogin } from '@/lib/next-auth';
import { authenticateUserInputSchema } from '@/schema';
import { AuthenticateUserInput } from '@/types';
import { onPromise } from '@/utils';
import { Button, HStack, Spinner, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasicConfig, mapFieldsToInputs } from '@/components';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { RegisterLink } from './register-link';
import { SignInResponse } from 'next-auth/react';

const UserAuthorizationConfig: BasicConfig<AuthenticateUserInput> = {
  defaultValues: {
    email: '',
    password: '',
  },
  fields: [
    {
      fieldName: 'email',
      element: 'input',
      label: 'Email',
      props: {
        placeholder: 'you@youremail.com',
        isRequired: true,
      },
    },
    {
      fieldName: 'password',
      element: 'input',
      label: 'Password',
      props: {
        type: 'password',
        placeholder: '**************',
        isRequired: true,
      },
    },
  ],
};

export const CredentialsAuthForm: React.FC = () => {
  const { defaultValues, fields } = UserAuthorizationConfig;

  const methods = useForm<AuthenticateUserInput>({
    resolver: zodResolver(authenticateUserInputSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<AuthenticateUserInput> = async (
    values
  ): Promise<SignInResponse | undefined> => credentialsLogin(values);

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        alignItems="flex-end"
        gap={4}
        // NOTE: onPromise helps satisfy the need for the handler to return a promise
        onSubmit={onPromise(methods.handleSubmit(onSubmit))}
      >
        {fields.map(mapFieldsToInputs)}
        <HStack w="full" justify="space-between">
          <RegisterLink />
          <Button
            type="submit"
            colorScheme="blue"
            size="sm"
            isLoading={methods.formState.isSubmitting}
            spinner={<Spinner />}
          >
            Submit
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
