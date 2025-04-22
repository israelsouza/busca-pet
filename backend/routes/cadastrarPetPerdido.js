import e from "express";

const router = e.Router();

router.post("/", async (req, res) => {
    const dados = req.body;
    console.log(dados)
})

export default router;