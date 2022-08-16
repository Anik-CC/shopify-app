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
  const [pid,setSelectedPID] = useState(true);


  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
    
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: (data) => {
        setIsLoading(false);
        const pid = JSON.parse(data.productID)
        const selectedPID = pid.productID
        setSelectedPID(selectedPID)
        
        setElement(data.productDetails)
         
      },
    },
  });



  


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
        title="Product 🛍️"
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
            <Heading>Product Selection</Heading>
            <TextContainer>
           

            <table style={{border: "3px black solid",padding:"10px",textAlign:"center"}}>
            <thead>
            <tbody>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Action</th>
                <th>Is Selected</th>
            {isLoadingCount}
              </tr>
              {isLoadingCount ? "⌛" :  Array.isArray(element) ? element.map((el,index)=><tr key={index}><td key={index}><img style={{height: "50px"}} src={el.image.src} alt="" /></td><td key={index}>{el.title}</td><td  style={{color: el.status == 'draft' ? "blue": "green"}}>{el.status}</td> <td key={index}><button key={index} onClick={()=>{handlePopulate(el.id)}}>{isLoading ? "⌛": "Choose This"}</button></td><td key={index}>{el.id == pid ? "✅" : "❌"}</td></tr>): "⌛"}
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
