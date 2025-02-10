import { useBoardStore } from "@/store/store"
import {useState} from 'react'

export default function BoardModal({setOpenBoardModal}:{setOpenBoardModal : (open : boolean)=>void}){
    const [newBoardName,setNewBoardName] = useState('')
    const {addBoard} = useBoardStore()
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
            <p className='my-2'>Give a name to your board - </p>
            <input type='text' className='p-1 border rounded-sm border-black' placeholder="Board Name" onChange={(e)=>{setNewBoardName(e.target.value)}}></input>  
            <div className='flex flex-row justify-between my-2'>
              <button className='p-1 bg-red-400 rounded-md' onClick={()=>{setOpenBoardModal(false)}}>Cancel</button> 
              <button className='p-1 bg-blue-400 rounded-md' onClick={()=>{
                addBoard(newBoardName)
                setOpenBoardModal(false)
              }}>Create</button> 
            </div>
          </div>
        </div>
    )
}