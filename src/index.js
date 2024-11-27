import express from "express";
// import dotenv from "dotenv"; // Uncomment if you're using dotenv
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

const productsList = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 50 },
  { id: 3, name: "Keyboard", price: 100 },
];

const usersList = [
  { id: 1, username: "John", displayName: "John Doe" },
  { id: 2, username: "nayla", displayName: "nayla jane" },
  { id: 3, username: "dhoi", displayName: "mahendra" },
];

// Routes
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/users/id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Please provide a user ID" });
  }
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }
  const user = usersList.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json(user);
});
app.get("/api/about", (req, res) => {
  res.status(200).json({ msg: "This is about page" });
});

app.get("/api/users", (req, res) => {
  console.log(req.query);
  const { username, password } = req.query;

  // Validate presence of username and password
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide both username and password" });
  }

  // Convert password to a number
  const parsedPassword = parseInt(password);

  // Validate that password is numeric
  if (isNaN(parsedPassword)) {
    return res.status(400).json({ msg: "Password must be a number" });
  }

  // Validate that username is a string
  if (!isNaN(username)) {
    return res.status(400).json({ msg: "Username must be a string" });
  }

  // Check for specific username and password
  if (!(username.toLowerCase() === "nayla" && parsedPassword === 100)) {
    return res.status(400).json({ msg: "Invalid username or password" });
  }

  // Find the user by username
  const user = usersList.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ id: user.id, displayName: user.displayName });
});

app.post("/api/users", (req, res) => {
  const { username, displayName } = req.body;
  if (!username || !displayName) {
    return res
      .status(400)
      .json({ msg: "Please provide both username and displayName" });
  }

  usersList.push({
    username: username,
    displayName: displayName,
    id: usersList.length + 1,
  });
  return res.status(200).json({
    msg: `${username} created successfully with id ${
      usersList.find((user) => user.username === username).id
    }`,
  });
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    //   return res.redirect("/api/users");
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  const user = usersList.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json(user);
});

app.get("/api/products", (req, res) => {
  res.status(200).json(productsList);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ msg: "Invalid product ID" });
  }

  const product = productsList.find((product) => product.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  res.status(200).json({ price: product.price });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }
  const user = usersList.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const { username, displayName } = req.body;
  if (!username || !displayName) {
    return res
      .status(400)
      .json({ msg: "Please provide both username and displayName" });
  }
  if (!(typeof username === "string" || typeof displayName === "string")) {
    return res
      .status(400)
      .json({ msg: "Username and displayName must be strings" });
  }
  user.username = username;
  user.displayName = displayName;
  res.status(200).json({
    msg: `${username} updated successfully`,
  });
});

app.delete("/api/users/:id", (req, res) => {
    const {id}=req.params;
    if(isNaN(parseInt(id))){
        return res.status(400).json({msg:"Invalid user ID"});
    }
    const user=usersList.find((user)=>user.id===parseInt(id));
    if(!user){
        return res.status(404).json({msg:"User not found"});
    }    
    const index=usersList.indexOf(user);
    usersList.splice(index,1);
    res.status(200).json({msg:`${user.username} deleted successfully`});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
