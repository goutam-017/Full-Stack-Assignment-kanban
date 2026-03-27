import React, { useState } from 'react'
import axiosInstance from '../services/axiosInstance'
import { toast } from 'react-toastify'

const CreateBoard = () => {
    const [name, setName] = useState("")
    const postData = {
        name
    }
    const createBoard = async () => {
        try {
            const { data } = await axiosInstance.post('api/boards/create/', postData)
            toast.success(data.msg)
            setName("")
        } catch (error) {
            const errorData = error.response?.data
            if (errorData?.name) {
                toast.error(errorData.name[0])
            } else if (errorData?.msg) {
                toast.error(errorData.msg)
            } else {
                toast.error("Something went wrong");
            }
        }

    }
    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Boards</h1>

            <div className="mb-4 flex gap-2">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New Board Name"
                    className="border p-2 rounded"
                    required
                />
                <button onClick={createBoard} className="bg-blue-500 text-white px-4 rounded">
                    Create
                </button>
            </div>
        </div>
    )
}

export default CreateBoard