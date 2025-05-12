Layout & State Management


<Layout>
    <MainContent data={data} formData={formData} setFormData={setFormData}>         <!-- Contains the main forms and data -->
        <Form>
            <Conatainer (div)>
                {data.map((category) => (
                    <DataSection category-{category}> <!-- Contains all of the data rendered from the database (input fields, items etc.)-->
                ))}
            </Conatainer (div)>
        </Form>
    </MainContent>
    <SideBar>
    </SideBar>
</Layout>
