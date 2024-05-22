import React, { useState } from 'react'

export const Model_Upload = () => {
    const[category, setcategory]=useState("")
    const[name, setName]=useState("")
    const[description, setDescription]=useState("")
    const[price, setPrice]=useState("")
    const[is_free, setIsFree]=useState(false)
    const [image, setImage] = useState("");
   

  return (
    <div className="main_div">
        <div className="form_div">
            <form action="">
                <div>
                    <label htmlFor="name">Enter Name</label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="description">Enter Description</label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="price">Enter Price</label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="is_free">Is It Paid?</label>
                    <input type="radio" />
                </div>
                

            </form>
            <div>
                <div>
                    <label htmlFor="image">Upload Image</label>
                    <input type="file" />
                </div>
            </div>
        </div>
    </div>
  )
}

