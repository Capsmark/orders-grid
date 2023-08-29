import { ReactNode, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import useUserStore from '@/stores/user-store';
import { useRouter } from 'next/router';
import Icon from '../components/icon';
import BlankLayout from '../layouts/BlankLayout';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
});

const defaultValues = {
  password: '',
  email: '',
};

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setLogin } = useUserStore();
  const { push } = useRouter();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { email, password } = data;
    setLoading(true);

    if (email === 'pooria@capsmark.co.uk' && password === 'C@psm@rk2023') {
      setLoading(false);
      setLogin(true);
      return push('/');
    }

    setLoading(false);
    return setError('email', {
      type: 'manual',
      message: 'Email or Password is invalid',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // width: '100%',
        height: 'calc(100vh - 9rem)',
      }}
    >
      <Card>
        <CardContent sx={{ p: (theme) => `${theme.spacing(10.5, 8, 8)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h6' sx={{ mb: 1.5 }}>
              {`Welcome to Capsmarks Orders Grid Bot`}
            </Typography>
            <Typography>Sign-in to use the grid bot</Typography>
          </Box>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='test@test.com'
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 1.5 }}>
              <InputLabel htmlFor='auth-login-password' error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
                            fontSize={20}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ mb: 4 }}
              disabled={loading}
            >
              {!loading && <span>Login</span>}
              {loading && <CircularProgress size={27} />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
