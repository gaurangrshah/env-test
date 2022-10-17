import { createUserOutputSchema } from '@/schema';
import { CreateUserInput, UserInput } from '@/types';
import { isBrowser, onPromise, trpc } from '@/utils';
import { Button, Spinner, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { mapFieldsToInputs, type BasicConfig } from '@/components/hook-form';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

const UserRegistrationConfig: BasicConfig<CreateUserInput> = {
  defaultValues: {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  },
  fields: [
    {
      fieldName: 'name',
      element: 'input',
      label: 'Name',
      props: {
        placeholder: 'Please provide your name',
        isRequired: true,
      },
    },
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
    {
      fieldName: 'passwordConfirm',
      element: 'input',
      label: 'Confirm Password',
      props: {
        type: 'password',
        placeholder: '**************',
        isRequired: true,
      },
    },
  ],
};

export const UserRegistrationForm: React.FC = () => {
  const router = useRouter();

  const { defaultValues, fields } = UserRegistrationConfig;

  const methods = useForm<UserInput>({
    resolver: zodResolver(createUserOutputSchema),
    defaultValues,
  });
  const { mutate, isLoading } = trpc.useMutation(['user.register-user'], {
    onSuccess: () => {
      if (isBrowser) {
        void router.push('/auth/signin?success=User Created Successfully.');
      }
    },
    onError: (error) => {
      if (error) {
        if (isBrowser) {
          console.error;
          void router.replace(`/auth/register/?error=${error.message}`);
        }
      }
    },
  });

  const onSubmit: SubmitHandler<UserInput> = (values) => mutate(values);

  return (
    <>
      <FormProvider {...methods}>
        <VStack
          as="form"
          alignItems="flex-end"
          gap={4}
          // NOTE: onPromise helps satisfy the need for the handler to return a promise
          onSubmit={onPromise(methods.handleSubmit(onSubmit))}
        >
          {fields.map(mapFieldsToInputs)}
          <Button
            type="submit"
            colorScheme="blue"
            size="sm"
            isLoading={isLoading}
            spinner={<Spinner />}
          >
            Register
          </Button>
        </VStack>
      </FormProvider>
    </>
  );
};
