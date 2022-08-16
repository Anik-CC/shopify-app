import { useState } from "react";
import { Card, Page, Layout, TextContainer, Heading, DisplayText, TextStyle} from "@shopify/polaris";
import { TitleBar,Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";



export default function PageName() {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();
  const [element,setElement] = useState(true);





  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
    
  } = useAppQuery({
    url: "/api/orders",
    reactQueryOptions: {
      onSuccess: async (data) => {

        console.log("in success")

        /* try {
          console.log("start Await")
          const orderArr = await checkorders(data.order)
          console.log(orderArr)
        } catch (error) {
          console.log(error)
        } */

       const res =  await checkorders(data.order)  
        const finalOrder = data.order.filter((el)=>{
          if(res.includes(String(el.id))){
            return el
          }
         
        })
        console.log(finalOrder)
        setElement(finalOrder)
     
        setIsLoading(false);
       
         
      },
    },
  });



  const checkorders =  async(data)=>{

    var orders = []
    const callAPI = async(el)=>{
      const res = await fetch("/api/order/metacheck/"+el.id)
      // const res = await fetch("/api/order/metacheck/4859065106666")


      // const orders = await response.json()
      return  res.json()
      // return  orders
}

     const final = async()=>{
      await Promise.all(data.map(async (el)=>{
        let response = []
        
      try {
        response = await callAPI(el)
        if(response.text.metafields != ""){
          orders.push(response.orderID)
          console.log(response.orderID)
        }
        
      } catch (error) {
        console.log(error)
      }
      
    }))
    return orders
   
  }
 
    let res = await final()
    console.log("order id is returned"+ orders)
    return res

  }


  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );


// This is the code to access the env file and make the product changes
  const handlePopulate = async (id) => {
    setIsLoading(true);
   
    console.log(isLoadingCount)
  
    const response =  fetch("api/products/change/"+id);
    
    response.then((response)=> response.json())
    .then((data)=>{
      setToastProps({ content: "Product has been selected" })
     
    })
    await refetchProductCount();
   
    

    
  };

  return (
    <Page>
      {toastMarkup}
    


      <TitleBar
        title="Order 🛒"
        sectioned
        primaryAction={{
          content: "Primary",
          onAction: () => handlePopulate,
        }}
        secondaryActions={[
          {
            content: "Secondary action",
            onAction: () => console.log("Secondary action"),
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Orders</Heading>
            <TextContainer>
           

            <table style={{border: "3px black solid",padding:"10px",}}>
            <thead>
            <tbody>
              <tr>
                <th>Order ID</th>
                <th>Email</th>
                <th>Action</th>
              
            {isLoadingCount}
              </tr>
              {isLoadingCount ? "⌛" :  Array.isArray(element) ? element.map((el,index)=><tr key={index}><td key={index}>{el.order_number}</td><td >{el.contact_email}</td> <td key={index}><button key={index} onClick={()=>{handlePopulate(el.id)}}>{isLoading ? "⌛": "Choose This"}</button></td></tr>): "⌛"}
              </tbody>
              </thead>
            </table>
            
            </TextContainer>
          </Card>



          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
