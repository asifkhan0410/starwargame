import React, { useEffect, useState } from 'react';
import './App.css';
import Icon from './component/icons/Icon';
import human from './images/user-circle-solid.svg'
import droid from './images/android.svg'
import question from './images/question-solid.svg'
import male from './images/male-solid.svg'
import female from './images/female-solid.svg'
import other from './images/snapchat-ghost-brands.svg'
import warning from './images/exclamation-triangle-solid.svg'
import loading from './images/spinner-solid.svg'

function App() {
  const [persons, setPersons]= useState({
    results:[],
    loading:false,
    emptysearch:false
  });
  const [previouspage,setPreviouspage]= useState(1);
  const [nextpage,setNextpage]= useState(2);
  const [input,setInput]= useState('');
  const [count,setCount]= useState(0);
  
  //the heading of the table storing in array to map it dynamically
  const headings = ["Species","Name","Gender","Height","Mass","Skin-Color","Hair-Color","Eye-Color","Birth-Year"];

  //useEffect fetches the persons list from the api as soon as the page opens
  useEffect(async () => {
    await fetchPersons();
  }, [])

  //search function for fetching th data
  useEffect(async () => {
    if(input!==null){
      const response = await fetch(`https://swapi.dev/api/people/?search=${input}`).then(res => res.json());
        if(response.count!==0){
          setCount(response.count)
          if(response.next!==null){
            setNextpage(response.next[response.next.length - 1]);
          }
          if(response.previous!==null){
            setPreviouspage(response.previous[response.previous.length - 1]);
          }
          setPersons({results:response.results, loading:true})
        }else{
          setCount(0);
          setPersons({results:[], loading:false,emptysearch:true})
        }
    }else{
      await fetchPersons();
    }
  },[input,count])

  //fetch function which fetches all the data
  const fetchPersons = async () => {
    const response = await fetch(`https://swapi.dev/api/people/`).then(res => res.json()).catch(err => console.log(err))
    if(response!==null){
      if(response.next!==null){
        setNextpage(response.next[response.next.length - 1]);
      }
      if(response.previous!==null){
        setPreviouspage(response.previous[response.previous.length - 1]);
      }

      setPersons({results:response.results, loading:true})
    }
  }

  //function to fetch next page
  const fetchnextPersons = async () => {
    const response = await fetch(`https://swapi.dev/api/people/?page=${nextpage}`).then(res => res.json())
    if(response.next!==null){
      setNextpage(response.next[response.next.length - 1]);
    }
    if(response.previous!==null){
      setPreviouspage(response.previous[response.previous.length - 1]);
    }

    setPersons({results:response.results, loading:true})
  }

  //fetch function for previous page
  const fetchpreviousPersons = async () => {
    const response = await fetch(`https://swapi.dev/api/people/?page=${previouspage}`).then(res => res.json())
    if(response.next!==null){
      setNextpage(response.next[response.next.length - 1]);
    }
    if(response.previous!==null){
      setPreviouspage(response.previous[response.previous.length - 1]);
    }

    setPersons({results:response.results, loading:true})
  }

  return (
    <div className ="app">
      <div className="app__header">
        <h1>STAR WARS</h1>
        {window.screen.width>415 ? (<input type="text" className="app__search" placeholder="Enter a name" onChange={(e)=> setInput(e.target.value) }/>):""}
      </div>
      <div className="app__middle">
        <div className="app__count">Total persons : {count}</div>
        {window.screen.width<415 ? (<input type="text" className="app__search" placeholder="Enter a name" onChange={(e)=> setInput(e.target.value) }/>):""} 
      </div>
      <div className="app__body">
        <div className="app__bodyheader">
          {headings.map((item,index) =>{
              return <h1 key={index}>{item}</h1>
          })}
        </div>
        <div className="app__bodydata">          
          {(persons.loading===true && persons.results!==null) ? (persons.results.map((item,index) => {
            return <div key={index} className="app__bodydataitem"> 
              {( item.species[0]=='http://swapi.dev/api/species/1/') ? (<Icon src={human} alt="Human"/>) : (item.species[0]=='http://swapi.dev/api/species/2/')? <Icon src={droid} alt="Droid"/>: <Icon src={question} alt="Question mark on who it is"/> }
              <h1>{item.name}</h1>
              {item.gender=="male"? <Icon src={male} alt="Male"/>: item.gender=="female"? <Icon src={female} alt="Female"/>: <Icon src={other} alt="Other"/>}
              <h1>{item.height}</h1>
              <h1>{item.mass}</h1>
              <h1>{item.skin_color}</h1>
              <h1>{item.hair_color}</h1>
              <h1>{item.eye_color}</h1>
              <h1>{item.birth_year}</h1>
            </div>
            })):(persons.loading===false && persons.emptysearch===true) ? (<div className="search__warning"><Icon src={warning} alt="No such item present"/> No such item is present with this name</div>) : <div className="loading">Loading... <Icon src={loading} alt="No such item present"/> </div>}
        </div>
      </div>
      <div className="app__footer" >
        <button disabled={previouspage<=0} onClick={fetchpreviousPersons}>Prev</button>
        <button disabled={nextpage>9} onClick={fetchnextPersons}>Next</button>
      </div>
    </div>
  );
}

export default App
