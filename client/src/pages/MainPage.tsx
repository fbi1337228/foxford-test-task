import { useEffect, useState } from "react";
import { axiosInstance } from "../shared/api/axiosInstance";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import type { CreateTaskData, Task } from "../shared/types/index.types";
import { useAuth } from "../shared/context/AuthContext";

const { Text } = Typography;

export default function MainPage() {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form] = Form.useForm();

  // Получение задач
  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get("/tasks");

      if (response.status === 200) {
        setTasks(response.data);
      }
    })();
  }, []);

  // Создание задачи
  const handleCreateTask = async (values: CreateTaskData) => {
    try {
      const newTask= await axiosInstance.post("/tasks", { ...values });

      if (newTask.status === 201) {
        setTasks((prev) => [newTask.data, ...prev]);
      }
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  // Удаление задачи
  const handleDeleteTask = async (id: string) => {
    try {
      const data = await axiosInstance.delete(`/tasks/${id}`);

      if (data.status === 204) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="task-container">
      <Title level={2}>Создание задачи:</Title>
      <Form onFinish={handleCreateTask} layout="vertical" form={form}>
        <Form.Item
          label="Название задачи"
          name="title"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Описание"
          name="description"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Создать
          </Button>
        </Form.Item>
      </Form>

      <Title level={2}>Задачи</Title>
      {tasks.length === 0 && <Text>У вас пока что нет задач</Text>}

      <Flex vertical gap={20}>
        <Title level={3}>Ваши созданные задачи</Title>
        {tasks.map((task) => (
          <Card key={task.id} title={task.title}>
            <Flex vertical gap={6}>
              <Text>{task.description}</Text>
              <Text type="secondary">ID автора: {task.authorId}</Text>
              <Text type="secondary">ID исполнителя: {task.executorId}</Text>
              {task.authorId === userId && (
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Удалить
                </Button>
              )}
            </Flex>
          </Card>
        ))}
      </Flex>
    </div>
  );
}
