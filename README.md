###  Next API Validation

This is basically the same as [serverless-request-validator](https://www.npmjs.com/package/serverless-request-validator) ready be used in Next.js

### How to use it:

It is nice to be able to programmatically define what you want your API endpoint(s) to do deppending on the request method used.

In express it's something like:

```js
app.get((req,res)=>{
    res.send("Something");
})
```
> That will work only when using a `GET` request

In Next.js (and Vercel) apps, your api are files in a specific order in the project directory, each file with a default export being the actual handler that will handle that request.

First, install the module:

```sh
npm install next-api-validation
```
Or
```sh
yarn add next-api-validation
```

Using it in any of your API routes in Next.js:

```js
import validation from "next-api-validation";

export default validation.get((req,res)=>{
    res.send("This only accepts GET request")
})
```
> As you can see, using the `get` method in the `validation` object prevents the handler from being executed if a different request method is used.

And so with other methods:


```js
// api/index.js or api/index.ts
import validation from "next-api-validation";

export default validation.post((req,res)=>{
    res.send("You just sent a POST request")
})
```
> This handler a POST request

**What if an endpoint should handle requests using more than one or two methods?**

Creating a default export of the function should solve that:

```js
// api/index.js or api/index.ts
import validate from "next-api-validation"

export default validate({
    get(req,res){
        res.send("A get request")
    },
    post(req,res){
        res.send("I only handle post requests"))
    },
    put(req,res){
        res.send("Did you put something?")
    }
})
```

The previous code handles requests that use three different methods, and calls only the necessary handler. An example of how it can be used:

```js
// CRUD of a MongoDB Document model

import { Post } from "src/Models";
import { connectToDatabase } from "src/utils";
import validate from "next-api-validation";

connectToDatabase();

export default validate({
  get: async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
  },
  post: async (req, res) => {
    const newPost = new Post(req.body);
    const saved = await newPost.save();
    res.send(saved);
  },
  put: async (req, res) => {
    const editedPost = await Post.findByIdAndUpdate(req.body._id, req.body);
    res.send(editedPost);
  },
  delete: async (req, res) => {
    const deletedPost = await Post.findByIdAndDelete(req.body._id);
    res.send(deletedPost);
  },
});
```
> Async handlers work too:), but this is thanks to Next.js itself, not me:P

That's it!

You can follow me on Github as [Danybeltran](https://github.com/danybeltran),  I sometimes works on other stuff. Check a similar package made for Vercel APIs: [serverless-request-validator](https://www.npmjs.com/package/serverless-request-validator), also by me. Thanks!