'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {useBoardStore} from '@/store/store'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased board bg-cover bg-center`} 
        style={{ backgroundImage: "url('/pawel-czerwinski-EnUCKcXwrnY-unsplash.jpg')" }}
      >
        <Navbar/> 
        {children}
        <Footer/>
      </body>
    </html>
  );
}

function Navbar(){
  const {resetAll} = useBoardStore()  
  return(
    <div className='flex flex-row justify-between mx-2 p-2'>
      <div className='hover:underline cursor-pointer'>Trello Board</div>
      <div className='flex flex-row gap-x-4'>
        <div className='hover:underline cursor-pointer' onClick={()=>{}}>Save to localStorage</div> 
        <div className='hover:underline cursor-pointer' onClick={resetAll}>Reset All</div>  
      </div>  
    </div>
  )
}

function Footer(){
  return(
    <div className='flex flex-row justify-between mx-2 p-2'>
      <div className='hover:underline cursor-pointer'>
        <a href="">Github Link</a>
      </div>  
      <div className='hover:underline cursor-pointer'>
        Photo by <a href="https://unsplash.com/@pawel_czerwinski?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pawel Czerwinski</a> on <a href="https://unsplash.com/photos/a-blue-and-white-abstract-background-with-wavy-lines-EnUCKcXwrnY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      </div>   
    </div>
  )
}