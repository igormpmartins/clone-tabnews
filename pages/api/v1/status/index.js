function status(req, res) {
  res.status(200).json({ data: "yo dude!" });
}

export default status;
