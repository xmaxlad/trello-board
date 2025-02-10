import {useState} from 'react'
import {Card} from '@/store/store'
import {X} from 'lucide-react'
import {useBoardStore} from '@/store/store'

export default function CardModal({boardId,listId,card,updateCard,removeCard,setOpenCardModal}:{boardId:string, listId: string, card : Card,updateCard: (boardId: string, listId: string, cardId: string, name: string, description: string, dueDate?: Date) => void,removeCard: (boardId: string, listId: string, cardId: string) => void, setOpenCardModal : (open : boolean)=>void}){
    const [newCardName,setNewCardName] = useState(card.name)
    const [newCardDescription,setNewCardDescription] = useState(card.description ?? '')  
    const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.toISOString().split('T')[0] : '');

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-grey-900 bg-opacity-50"> 
          <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
            <div className='flex flex-row justify-between items-center'>
              <p className='my-2'>Card Name -  </p>
              <X onClick={()=>{setOpenCardModal(false)}}/>
            </div>
            <input type='text' className='p-1 border rounded-sm border-black' placeholder="Card Name" value={newCardName} onChange={(e)=>{setNewCardName(e.target.value)}}></input>
            <p className='my-2'>Card Description -  </p>
            <input type='text' className='p-1 border rounded-sm border-black' placeholder="Card Description" value={newCardDescription} onChange={(e)=>{setNewCardDescription(e.target.value)}}></input>  
            <p className='my-2'>Due Date -  </p>
            <input type='date' className='p-1 border rounded-sm border-black' value={dueDate} onChange={(e)=>{setDueDate(e.target.value)}}></input>
            <div className='flex flex-row justify-between my-2'>
              <button className='p-1 bg-red-400 rounded-md' onClick={()=>{
                removeCard(boardId, listId, card.id) 
                setOpenCardModal(false) 
              }}>Delete</button>  
              <button className='p-1 bg-blue-400 rounded-md' onClick={()=>{
                updateCard(boardId, listId, card.id, newCardName, newCardDescription as string, dueDate ? new Date(dueDate) : undefined) 
                setOpenCardModal(false)
              }}>Save</button>  
            </div>
          </div>
        </div>
    )
}