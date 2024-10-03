import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', hobby: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) || [];
    setData(storedData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const newData = [...data];
      newData[editIndex] = formData;
      setData(newData);
      setEditIndex(null);
    } else {
      setData([...data, formData]); // Add new data at the end
    }
    setFormData({ name: '', email: '', password: '', hobby: '' });
    localStorage.setItem('userData', JSON.stringify([...data, formData])); // Update localStorage
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    localStorage.setItem('userData', JSON.stringify(newData)); // Update localStorage
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hobby.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    return a[sortField].localeCompare(b[sortField]) * order;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">CRUD Operations with Sorting, Searching, and Pagination</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-row">
          <div className="col fw-bold my-3">
            <input type="text" className="form-control" placeholder="Name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="col fw-bold my-3">
            <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="col fw-bold my-3">
            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} required />
          </div>
          <div className="col fw-bold my-3">
            <select className="form-control" name="hobby" value={formData.hobby} onChange={handleInputChange} required>
              <option value="">Select Hobby</option>
              <option value="Reading">Reading</option>
              <option value="Gaming">Gaming</option>
              <option value="Traveling">Traveling</option>
            </select>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary fw-bold">{editIndex !== null ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </form>

      <input type="text" className="form-control mb-3" placeholder="Search by name, email, or hobby" onChange={handleSearch} />
      <h4 className='my-4'>* Clicked On Title For Sorting </h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{cursor:"pointer"}}>Name</th>
            <th onClick={() => handleSort('email')} style={{cursor:"pointer"}}>Email</th>
            <th onClick={() => handleSort('hobby')} style={{cursor:"pointer"}}>Hobby</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.hobby}</td>
              <td>
                <button className="btn btn-warning btn-sm mx-2 fw-bold" onClick={() => handleEdit(index)}>Edit</button>
                <button className="btn btn-danger btn-sm fw-bold" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default App;