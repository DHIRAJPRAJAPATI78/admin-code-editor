import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='pt-18 text-amber-50'>
        <Link to="/admin/login"> Login </Link>
    </div>
  )
}

export default Home