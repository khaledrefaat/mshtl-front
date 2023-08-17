import { useContext, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
// styles
import styles from './Login.module.css';
import { AuthContext } from '../components/context/AuthContext';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';

export default function Login() {
  const [password, setPassword] = useState('');
  const { login, token } = useContext(AuthContext);
  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await sendRequest(
        import.meta.env.VITE_URI + '/users/login',
        'POST',
        JSON.stringify({ password }),
        {
          'Content-Type': 'application/json',
        }
      );

      if (data) {
        console.log(data);
        login(data.admin, data.token);
      } else {
        setTimeout(() => {
          clearError();
        }, 3000);
      }
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <h2>login</h2>
        <label>
          <span>username:</span>
          <input type="text" value={'Admin'} />
        </label>
        <label>
          <span>password:</span>
          <input
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button className="btn">Login</button>
        {error && (
          <Alert variant="danger" key="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {token && <p>{token}</p>}
      </form>
    </>
  );
}
