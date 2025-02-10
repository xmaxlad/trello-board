'use client'

import {useEffect, useState} from 'react'
import { useBoardStore } from '@/store/store'
import {Plus,X,Trash,Ellipsis,ChevronRight} from 'lucide-react'
import BoardModal from '@/components/BoardModal'
import {Board,List} from '@/store/store' 
import clsx from 'clsx'
import CardModal from '@/components/CardModal'

export default function Home() {
  const {boards,removeBoard,addList,moveCard,removeList,updateListName,addCard,removeCard,updateCard, reorderList,reorderCard} = useBoardStore()
  const [currentBoard,setCurrentBoard] = useState<Board | null>(null) 
  const [currentList,setCurrentList] = useState<List | null>(null)  

  const [openBoardModal,setOpenBoardModal] = useState<boolean>(false)
  const [openCardModal,setOpenCardModal] = useState<boolean>(false) 

  const [showListCreate,setShowListCreate] = useState<boolean>(false)
  const [newListName,setNewListName] = useState<string>('') 
  const [showCreateCard,setShowCreateCard] = useState<string | boolean>(false)  
  const [newCardName,setNewCardName] = useState('')

  const [openEllipsisModal, setOpenEllipsisModal] = useState<boolean>(false)

  const handleCardDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: string, fromListId: string,fromIndex : number) => {
    e.dataTransfer.setData("cardId", cardId)
    e.dataTransfer.setData("fromListId", fromListId)
    e.dataTransfer.setData("fromIndex",fromIndex.toString()) 
  }

  const handleListDragStart = (e: React.DragEvent<HTMLDivElement>, listId: string) => {
    e.dataTransfer.setData("listId", listId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleItemDrop = (e : React.DragEvent<HTMLDivElement>,targetListId : string,toIndex : number) => {
    e.preventDefault() 
    const fromListId = e.dataTransfer.getData("fromListId") 
      if(fromListId === ''){
        const listId = e.dataTransfer.getData("listId")
        const targetListIndex = currentBoard?.lists.findIndex(list => list.id === targetListId)
        const draggedListIndex = currentBoard?.lists.findIndex(list => list.id === listId)

        if (targetListIndex !== -1 && draggedListIndex !== -1 && targetListIndex !== draggedListIndex) {
          reorderList(currentBoard?.id as string, listId, targetListIndex as number)
        } 
    }else{
      const cardId = e.dataTransfer.getData("cardId")
      if(fromListId !== targetListId){
        moveCard(currentBoard?.id as string, fromListId, targetListId, cardId)
        return 
      }
      const fromIndex = parseInt(e.dataTransfer.getData("fromIndex")) 
      reorderCard(currentBoard?.id as string,fromListId,fromIndex,toIndex)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  useEffect(()=>{
    if(currentBoard !== null){
      const currBoard = boards.find((board)=>{ 
        return board.id === currentBoard.id
      }) as Board 
      setCurrentBoard(currBoard)
    }
  },[boards])

  function CardOptionsModal(){
    return(
      <div>

      </div>
    )
  }

  
  return(
    <div className='flex flex-row m-4 h-svh'>
      <div className='w-1/6 border border-grey-900 p-2'>
      <div className='flex flex-row justify-between items-center'>
        <p>Boards</p>
        <Plus className='cursor-pointer' size={24} onClick={()=>{setOpenBoardModal(true)}}/>  
        {openBoardModal && <BoardModal setOpenBoardModal={setOpenBoardModal}/>} 
      </div>
      <div>
      {boards.length === 0 ? (
        <div>
          No boards found.
        </div>) : 
        (<div>
          {boards.map((board,idx)=>(
            <div key={idx} className={clsx('m-1 p-1 border border-grey-900 cursor-pointer', currentBoard === board ? 'bg-blue-400' : '')} onClick={()=>{setCurrentBoard(board)}}> 
              {board.name}
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
      <div className='w-5/6 mx-4 border border-grey-900 p-2 overflow-x-auto'>
      {currentBoard === null ? (
        <div>
          Select a board to see lists.
        </div>
      ) : (
        <div className='flex flex-row'

        >
          {currentBoard?.lists.map((list,i)=>( 
            <div id='lists' key={i} className='min-w-64 border border-grey-900 p-1 mx-1' 
              onDragStart={(e) => handleListDragStart(e, list.id)}
              draggable
              onDrop={(e) => handleItemDrop(e, list.id,0)} 
              onDragOver={handleDragOver}
            > 
              <div className='flex flex-row items-center justify-between my-2'>
                {list.name} 
                <Trash size={18} onClick={()=>{removeList(currentBoard.id, list.id)}} /> 
              </div>
              {list.cards.map((card,idx)=>(
                <div id='cards' key={idx} className='border border-grey-900 flex flex-row justify-between items-center py-px my-1' 
                  draggable 
                  onDragStart={(e) => handleCardDragStart(e, card.id, list.id,idx)} 
                >  
                  <p>{card.name}</p>
                  <div className='relative'>
                    <X size={20} onClick={()=>{removeCard(currentBoard.id,list.id,card.id)}}/> 
                  </div>
                </div>
              ))}
              <div className='flex flex-row justify-end items-center my-2'>
              <Plus size={20} onClick={()=>{
                setShowCreateCard(list.id) 
                setCurrentList(list)  
              }}/> 
              {
                showCreateCard === list.id && (
                  <>
                    <input type='text' placeholder='Card name' className='px-2' value={newCardName} onChange={(e)=>{setNewCardName(e.target.value)}}></input>
                    <ChevronRight onClick={()=>{
                      addCard(currentBoard.id,list.id,newCardName,null)
                      setNewCardName('') 
                    }}/>
                  </>
                )
              }
              </div>
            </div>
          ))}
          <div>
            <div className='flex flex-row items-center justify-between gap-x-2 min-w-64'>
              <p>Create a new list</p>
              <Plus onClick={()=>{setShowListCreate(true)}}/>
            </div>
              {showListCreate && (
                <div className='flex flex-row gap-x-2'>
                  <input 
                    type='text' 
                    className='border rounded-md border-grey-900 p-1' 
                    value={newListName} 
                    onChange={(e) => setNewListName(e.target.value)} 
                    placeholder='New list name' 
                  />
                  <button 
                    className='bg-blue-500 rounded-md text-white p-1' 
                    onClick={() => {
                      addList(currentBoard.id,newListName)
                      setNewListName('')
                    }} 
                  >
                    Add List
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
