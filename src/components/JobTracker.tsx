"use client"; // Add this line to mark the file as a Client Component

import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query";
import { useForm } from "react-hook-form";
import {
  fetchJobs,
  addJob,
  updateJob,
  deleteJob,
} from "@/api/api";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Job {
  _id?: string;
  company: string;
  position: string;
  salary: string;
  status: string;
  note: string;
}

const JobTracker: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery("jobs", fetchJobs);

  const addMutation = useMutation(addJob, {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      toast.success("Запись успешно добавлена!");
      closeModal();
    },
    onError: () => {
      toast.error("Ошибка при добавлении записи.");
    },
  });

  const updateMutation = useMutation(({ id, job }: { id: string; job: Job }) => updateJob(id, job), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      toast.success("Запись успешно обновлена!");
      closeModal();
    },
    onError: () => {
      toast.error("Ошибка при обновлении записи.");
    },
  });

  const deleteMutation = useMutation((id: string) => deleteJob(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      toast.success("Запись успешно удалена!");
    },
    onError: () => {
      toast.error("Ошибка при удалении записи.");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Job>({
    defaultValues: {
      company: '',
      position: '',
      salary: '',
      status: '',
      note: ''
    }
  });

  const openModal = (job?: Job) => {
    setIsModalOpen(true);
    if (job) {
      setSelectedJob(job);
      reset(job); // Устанавливаем старые данные при открытии модального окна
    } else {
      reset(); // Очистка формы, если это новая запись
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    reset();
  };

  const onSubmit = (data: Job) => {
    if (selectedJob) {
      updateMutation.mutate({ id: selectedJob._id!, job: data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 mb-4 rounded"
          onClick={() => openModal()}
        >
          + Добавить запись
        </button>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Компания</th>
                <th className="border border-gray-300 px-4 py-2">Вакансия</th>
                <th className="border border-gray-300 px-4 py-2">Зарплата</th>
                <th className="border border-gray-300 px-4 py-2">Статус</th>
                <th className="border border-gray-300 px-4 py-2">Заметка</th>
                <th className="border border-gray-300 px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job: Job) => (
                <tr key={job._id}>
                  <td className="border border-gray-300 px-4 py-2">{job.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.position}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.salary}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.note}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                      onClick={() => openModal(job)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(job._id!)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-black p-6 rounded shadow-md max-w-md w-full">
              <h2 className="text-xl text-black font-bold mb-4">
                {selectedJob ? "Редактировать запись" : "Добавить запись"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <label>Компания</label>
                  <input
                    {...register("company", {
                      required: "Компания обязательна",
                      minLength: {
                        value: 3,
                        message: "Название компании должно быть не короче 3 символов"
                      }
                    })}
                    className={`border w-full p-2 text-black ${errors.company ? "border-red-500" : ""}`}
                  />
                  {errors.company && <span className="text-red-500">{errors.company.message}</span>}
                </div>
                <div className="mb-2">
                  <label>Вакансия</label>
                  <input
                    {...register("position", {
                      required: "Вакансия обязательна",
                      minLength: {
                        value: 2,
                        message: "Название вакансии должно быть не короче 2 символов"
                      }
                    })}
                    className={`border w-full p-2 text-black ${errors.position ? "border-red-500" : ""}`}
                  />
                  {errors.position && <span className="text-red-500">{errors.position.message}</span>}
                </div>
                <div className="mb-2">
                  <label>Зарплата</label>
                  <input
                    {...register("salary", {
                      required: "Зарплата обязательна",
                      pattern: {
                        value: /^\d+$/,
                        message: "Зарплата должна быть числом"
                      }
                    })}
                    className={`border w-full p-2 text-black ${errors.salary ? "border-red-500" : ""}`}
                  />
                  {errors.salary && <span className="text-red-500">{errors.salary.message}</span>}
                </div>
                <div className="mb-2">
                  <label>Статус</label>
                  <input
                    {...register("status", {
                      required: "Статус обязателен"
                    })}
                    className={`border w-full p-2 text-black ${errors.status ? "border-red-500" : ""}`}
                  />
                  {errors.status && <span className="text-red-500">{errors.status.message}</span>}
                </div>
                <div className="mb-2">
                  <label>Заметка</label>
                  <input
                    {...register("note", {
                      required: "Заметка обязательна",
                      maxLength: {
                        value: 200,
                        message: "Заметка не должна превышать 200 символов"
                      }
                    })}
                    className={`border w-full p-2 text-black ${errors.note ? "border-red-500" : ""}`}
                  />
                  {errors.note && <span className="text-red-500">{errors.note.message}</span>}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={closeModal}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
};

export default JobTracker;
