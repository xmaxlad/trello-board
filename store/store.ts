import { List } from "lucide-react";
import { create } from "zustand";

export type Card = {
  id: string;
  name: string;
  description?: string;
  dueDate?: Date;
};

export type List = {
  id: string;
  name: string;
  cards: Card[];
};

export type Board = {
  id: string;
  name: string;
  lists: List[];
};

type BoardState = {
  boards: Board[];
  addBoard: (name: string) => void;
  removeBoard: (boardId: string) => void;
  addList: (boardId: string, name: string) => void;
  removeList: (boardId: string, listId: string) => void;
  updateListName: (boardId: string, listId: string, name: string) => void;
  addCard: (boardId: string, listId: string, name: string) => void;
  removeCard: (boardId: string, listId: string, cardId: string) => void;
  updateCard: (boardId: string, listId: string, cardId: string, name: string, description: string, dueDate?: Date) => void;
  moveCard : (boardId : string, fromListId : string, toListId : string, toIndex : number, cardId : string) => void;
  resetAll : () => void;
  reorderList: (boardId: string, listId: string, newIndex: number) => void;
  reorderCard: (boardId: string, listId: string, currentIndex: number, newIndex: number) => void;
  resetBoard: (boardId: string) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],

  addBoard: (name) =>
    set((state) => ({
      boards: [...state.boards, { id: crypto.randomUUID(), name, lists: [] }],
    })),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
    })),

  addList: (boardId, name) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, lists: [...board.lists, { id: crypto.randomUUID(), name, cards: [] }] }
          : board
      ),
    })),

  removeList: (boardId, listId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, lists: board.lists.filter((list) => list.id !== listId) }
          : board
      ),
    })),

  updateListName: (boardId, listId, name) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, name } : list
              ),
            }
          : board
      ),
    })),

  addCard: (boardId, listId, name) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      cards: [...list.cards, { id: crypto.randomUUID(), name}],
                    }
                  : list
              ),
            }
          : board
      ),
    })),

  removeCard: (boardId, listId, cardId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
                  : list
              ),
            }
          : board
      ),
    })),

  updateCard: (boardId, listId, cardId, name, description, dueDate) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId ? { ...card, name, description, dueDate } : card
                      ),
                    }
                  : list
              ),
            }
          : board
      ),
    })),

    moveCard: (boardId, fromListId, toListId,toIndex, cardId) =>  
      set((state) => ({
        boards : state.boards.map((board)=>{
          if(board.id === boardId){
            let card = board.lists.find((l) => l.id === fromListId)?.cards.find((c) => c.id === cardId) 
            return {
              ...board,
              lists : board.lists.map((list) => {
                if(fromListId === list.id){
                  return {
                    ...list,
                    cards : list.cards.filter((card)=>card.id !== cardId) 
                  } 
                }
                if(toListId === list.id && card !== undefined){ 
                  const newCards = [...list.cards]
                  newCards.splice(toIndex,0,card) 
                  return {
                    ...list,
                    cards : newCards 
                  } 
                }
                return list 
              })
            }
          }
          return board 
        })
      })),

      reorderList: (boardId: string, listId: string, newIndex: number) =>
        set((state) => {
          const board = state.boards.find((board) => board.id === boardId)
          if (!board) return state
    
          const currentLists = [...board.lists]
          const listIndex = currentLists.findIndex((list) => list.id === listId)
          if (listIndex === -1 || newIndex < 0 || newIndex >= currentLists.length) return state
    
          const [movedList] = currentLists.splice(listIndex, 1)
          currentLists.splice(newIndex, 0, movedList)
    
          return {
            boards: state.boards.map((b) =>
              b.id === boardId ? { ...b, lists: currentLists } : b
            ),
          };
        }),

      
    resetAll : () => 
      set(()=>({
        boards : [] 
      })),

  reorderCard: (boardId: string, listId: string, currentIndex: number, newIndex: number) =>
    set((state) => {
      const board = state.boards.find((board) => board.id === boardId)
      if (!board) return state

      const list = board.lists.find((list) => list.id === listId)
      if (!list) return state

      const currentCards = [...list.cards]
      if (newIndex < 0 || newIndex >= currentCards.length) return state

      const [movedCard] = currentCards.splice(currentIndex, 1)
      currentCards.splice(newIndex, 0, movedCard) 

      return {
        boards: state.boards.map((b) =>
          b.id === boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === listId ? { ...l, cards: currentCards } : l
                ),
              }
            : b
        ),
      };
    }),

  resetBoard: (boardId: string) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, lists: [] }
          : board
      ),
    })),
}));
