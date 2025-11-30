import { useAuth } from "../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Form, Input, Typography } from "antd";
import type { UserData } from "../shared/types/index.types";

export default function SignInPage() {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Аутентификация 
  const handleSubmit = async (values: UserData) => {
    const { email, password } = values;
    try {
      const res = await login(email, password);

      if (res.accessToken) {
        navigate("/");
      }
    } catch (err) {
      console.error("Ошибка при входе:", err);
    }
  };

  return (
    <Flex align="center" justify="center">
      <Form
        form={form}
        className="sign-form"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Typography.Title level={3}>Вход</Typography.Title>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Введите email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Войти
          </Button>
        </Form.Item>
        <Typography onClick={() => navigate("/sign-up")}>
          Нет аккаунта? <span style={{ color: "blue" }}>Регистрация</span>
        </Typography>
      </Form>
    </Flex>
  );
}
