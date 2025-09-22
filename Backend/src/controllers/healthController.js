exports.getHealth = (req,res)=>{
    res.status(200).json({message : "HealthyHabits API running"})
}