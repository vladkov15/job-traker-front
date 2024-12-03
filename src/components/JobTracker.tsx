"use client";
import { addJob, deleteJob, fetchJobs, updateJob } from "@/api/api";
import { useEffect, useState } from "react";


interface Job {
  _id?:string;
  company: string;
  position: string;
  salary: string;
  status: string
  note: string;
}

const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newJob, setNewJob] = useState<Job>({
    company: "",
    position: "",
    salary: "",
    status: "",
    note: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [editJobData, setEditJobData] = useState<Job | null>(null);

  useEffect(() => {
    async function fetchposition() {
      const vacancies:Job[]  = await fetchJobs()
     setJobs(vacancies)
     console.log(vacancies);
     
    }
    fetchposition()
  },[])

  const openEditModal = (index: number) => {
    setSelectedJobIndex(index);
    setEditJobData({ ...jobs[index] });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditJobData(null);
  };

  const confirmDelete = (index: number) => {
    setSelectedJobIndex(index);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedJobIndex(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewJob({
      _id: "",
      company: "",
      position: "",
      salary: "",
      status: "",
      note: "",
    });
    setErrors({});
  };

  const validateJob = (job: Job) => {
    const newErrors: { [key: string]: boolean } = {};
    if (!job.company) newErrors.company = true;
    if (!job.position) newErrors.position = true;
    if (!job.status) newErrors.status = true
    if (!job.salary) newErrors.salary = true;
    if (!job.note) newErrors.note = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddJob = async () => {  
    console.log(newJob);
    
    if (validateJob(newJob)) {
      await addJob(newJob)
      setJobs([...jobs, newJob]);
      closeModal();
    }
  };

  const handleDeleteJob = async (index: number) => {
    console.log(jobs[index]);
    
    if(!jobs[index]._id) return;
    setJobs(jobs.filter((_, i) => i !== index));
    await deleteJob(jobs[index]._id)
    setIsDeleteConfirmOpen(false);
  };

  const editJob = async (index: number, updatedJob: Job) => {
    if (
      !updatedJob.company ||
      !updatedJob.position ||
      !updatedJob.salary ||
      !updatedJob.note
    ) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }
    await updateJob(updatedJob._id!, updatedJob)
    setJobs(jobs.map((job, i) => (i === index ? updatedJob : job)));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Компания 🏢</th>
              <th className="border border-gray-300 px-4 py-2">Вакансия 📋</th>
              <th className="border border-gray-300 px-4 py-2">
                Зарплатная вилка 💸
              </th>
              <th className="border border-gray-300 px-4 py-2">Статус 📊</th>
              <th className="border border-gray-300 px-4 py-2">Заметка 📝</th>
              <th className="border border-gray-300 px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {job.company}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.position}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.salary}$
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">{job.note}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => confirmDelete(index)}
                  >
                    Удалить
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => openEditModal(index)}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4 block md:inline-block rounded"
        onClick={openModal}
      >
        + Добавить запись
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-md max-w-md w-full sm:max-w-lg md:max-w-xl">
            <h2 className="text-xl font-bold mb-4">Добавить запись</h2>
            <div className="mb-2">
              <label>Компания 🏢</label>
              <input
                type="text"
                value={newJob.company}
                onChange={(e) =>
                  setNewJob({ ...newJob, company: e.target.value })
                }
                className={`border-2 w-full p-2 text-black ${
                  errors.company ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="mb-2">
              <label>Вакансия 📋</label>
              <input
                type="text"
                value={newJob.position}
                onChange={(e) =>
                  setNewJob({ ...newJob, position: e.target.value })
                }
                className={`border-2 w-full p-2 text-black ${
                  errors.position ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="flex space-x-2">
              <div className="mb-2 w-full sm:w-1/2">
                <label>Зарплатная вилка 💸</label>
                <input
                  type="text"
                  value={newJob.salary}
                  onChange={(e) =>
                    setNewJob({ ...newJob, salary: e.target.value })
                  }
                  className={`border-2 w-full p-2 text-black ${
                    errors.salary ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>
            <div className="mb-2">
              <label>Статус 📊</label>
              <input
                  type="text"
                  value={newJob.status}
                  onChange={(e) =>
                    setNewJob({ ...newJob, status: e.target.value })
                  }
                  className={`border-2 w-full p-2 text-black ${
                    errors.status ? "border-red-500" : ""
                  }`}
                />
            </div>
            <div className="mb-2">
              <label>Заметка 📝</label>
              <input
                type="text"
                value={newJob.note}
                onChange={(e) => setNewJob({ ...newJob, note: e.target.value })}
                className={`border-2 w-full p-2 text-black ${
                  errors.note ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Отмена
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddJob}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editJobData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-md max-w-md w-full sm:max-w-lg md:max-w-xl">
            <h2 className="text-xl font-bold mb-4">Редактировать запись</h2>
            <div className="mb-2">
              <label>Компания 🏢</label>
              <input
                type="text"
                value={editJobData.company}
                onChange={(e) =>
                  setEditJobData({ ...editJobData, company: e.target.value })
                }
                className="border-2 w-full p-2 text-black"
              />
            </div>
            <div className="mb-2">
              <label>Вакансия 📋</label>
              <input
                type="text"
                value={editJobData.position}
                onChange={(e) =>
                  setEditJobData({ ...editJobData, position: e.target.value })
                }
                className="border-2 w-full p-2 text-black"
              />
            </div>
            <div className="flex space-x-2">
              <div className="mb-2 w-full sm:w-1/2">
                <label>Зарплатная вилка 💸</label>
                <input
                  type="text"
                  value={editJobData.salary}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      salary: e.target.value,
                    })
                  }
                  className="border-2 w-full p-2 text-black"
                />
              </div>
            </div>
            <div className="mb-2">
            <label>Статус 📊</label>
            <input
                  type="text"
                  value={editJobData.status}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      status: e.target.value,
                    })
                  }
                  className="border-2 w-full p-2 text-black"
                />
            </div>
            <div className="mb-2">
              <label>Заметка 📝</label>
              <input
                type="text"
                value={editJobData.note}
                onChange={(e) =>
                  setEditJobData({ ...editJobData, note: e.target.value })
                }
                className="border-2 w-full p-2 text-black"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                onClick={closeEditModal}
              >
                Отмена
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (selectedJobIndex !== null) {
                    editJob(selectedJobIndex, editJobData);
                    setIsEditModalOpen(false)
                  }
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && selectedJobIndex !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={cancelDelete}
              >
                Отмена
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteJob(selectedJobIndex)}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
