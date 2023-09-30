import Input from '../UI/Input';
import Button from '../UI/Button';

const LoginForm = () => {
  return (
    <form className="rounded-md">
      <Input
        label="Email"
        input={{
          id: 'email',
          type: 'email'
        }}
      />
      <Input
        className="mb-5"
        label="Password"
        input={{
          id: 'password',
          type: 'password'
        }}
      />
      <Button type="submit" styleType="primary">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
