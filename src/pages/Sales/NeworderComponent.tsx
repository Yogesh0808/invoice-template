import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SofaForm from './orderForm/SofaForm';
import BlindsForm from './orderForm/BlindsForm';
import CurtainsForm from './orderForm/CurtainsForm';
import FlooringForm from './orderForm/FlooringForm';
import WallpaperForm from './orderForm/WallpaperForm';
import FurnitureForm from './orderForm/FurnitureForm'; // Add this import

axios.defaults.baseURL = 'https://cors-h05i.onrender.com';

const CustomerTable = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    size: '',
    shapeModel: 'L-Shaped',
    referenceImage: null,
    fabricNameCode: '',
    fabricImage: null,
  });
  const [customers, setCustomers] = useState([]);

  const getHeaders = () => {
    const username = 'abinesh';
    const password = 'abi';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    return {
      headers: {
        Authorization: basicAuth,
      },
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your logic for form submission goes here
    setNotification('Form submitted successfully');
    setShowModal(false); // Close modal after submission
    // Reset form or do any other necessary actions
    setFormData({
      ...formData,
      [selectedProduct]: '',
    });
  };

  const productImages = {
    Curtains:
      'https://ik.imagekit.io/tealcdn2023/assets/curtains.png?updatedAt=1708796208451',
    Sofas: 'https://cdn-icons-png.flaticon.com/512/5781/5781883.png',
    Blinds:
      'https://ik.imagekit.io/tealcdn2023/assets/blinds.png?updatedAt=1708795944875',
    Carpets:
      'https://cdn.iconscout.com/icon/premium/png-256-thumb/carpet-1469898-1243937.png?f=webp',
    Floorings:
      'https://ik.imagekit.io/tealcdn2023/assets/flooring.png?updatedAt=1708795833951',
    Wallpaper:
      'https://ik.imagekit.io/tealcdn2023/assets/wallpaper.png?updatedAt=1708795761824',
    Furniture:
      'https://ik.imagekit.io/tealcdn2023/assets/Decor.png?updatedAt=1708795608010',
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/clients/names', getHeaders());
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  const handleCategorySelect = (product) => {
    setSelectedProduct(product);
    setShowModal(true); // Show modal when a card is clicked
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      ...formData,
      [selectedProduct]: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // Fetch customers when the component mounts
    fetchCustomers();
  }, []);
  const handleFormSubmit = async (formData) => {
    try {
      console.log('Handle Form Submission Called');
      const { clientName } = selectedCustomer;
      const dataToSubmit = { ...formData, customerName: clientName };
      console.log('Submitted Data:', dataToSubmit); // Logging the object directly
      const response = await axios.post(
        '/api/products/floorings',
        dataToSubmit,
        {
          headers: {
            Authorization: 'Basic ' + btoa('abinesh:abi'),
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Form submission response:', response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  const renderProductForm = () => {
    switch (selectedProduct) {
      case 'Curtains':
        return (
          <CurtainsForm
            formData={formData}
            onInputChange={(e) => handleInputChange(e)}
            onCloseModal={handleCloseModal}
            onSubmit={handleSubmit}
          />
        );
      case 'Sofas':
        return (
          <SofaForm
            formData={formData}
            onInputChange={(e) => handleInputChange(e)}
            onCloseModal={handleCloseModal}
            onSubmit={handleSubmit}
          />
        );
      case 'Blinds':
        return (
          <BlindsForm onCloseModal={handleCloseModal} onSubmit={handleSubmit} />
        );

      case 'Wallpaper':
        return (
          <WallpaperForm
            onCloseModal={handleCloseModal}
            onSubmit={handleSubmit}
          />
        );

      case 'Floorings':
        return (
          <FlooringForm
            onSubmit={handleFormSubmit}
            onCloseModal={handleCloseModal}
          />
        );

      case 'Furniture': // Add the case for Furniture
        return (
          <FurnitureForm
            onSubmit={handleFormSubmit}
            onCloseModal={handleCloseModal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Show customer selection dropdown if no customer is selected */}
      {!selectedCustomer && (
        <select
          value={selectedCustomer ? selectedCustomer.id : ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedCustomer = customers.find(
              (customer) => customer.id === selectedId,
            );
            setSelectedCustomer(selectedCustomer);
          }}
          className="block w-full mt-4 p-3 border border-slate-400 shadow-lg rounded-xl dark:bg-slate-950 focus:outline-none focus:border-strokedark"
        >
          <option value="">Select Customer</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer.id}>
              {customer.clientName} - {customer.id}
            </option>
          ))}
        </select>
      )}

      {/* Show cards and modal if a customer is selected */}
      {selectedCustomer && (
        <>
          <button
            onClick={() => setSelectedCustomer(null)}
            className="top-4 right-4"
          >
            Back
          </button>

          {/* Cards */}
          {/* New Order For {client Name} */}
          <p className="text-center text-slate-700 dark:text-slate-50 text-2xl">
            New Order For {selectedCustomer.clientName} - {selectedCustomer.id}
          </p>

          <div className="flex justify-center items-center lg:h-96 sm:h-screen my-10 bg-gray-100 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                'Curtains',
                'Sofas',
                'Blinds',
                'Floorings',
                'Wallpaper',
                'Furniture',
              ].map((product, index) => (
                <div
                  key={index}
                  onClick={() => handleCategorySelect(product)}
                  className="rounded-lg bg-blue-200 shadow-lg overflow-hidden dark:bg-blue-950"
                >
                  <img
                    src={productImages[product]}
                    alt={product}
                    className="w-full lg:h-32 sm:h-28 p-4"
                  />
                  <div className="p-4">
                    <p className="text-center text-blue-800 bg-blue-50 dark:text-white dark:bg-blue-800 rounded-xl py-1 text-xl font-normal">
                      {product}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 shadow-xl rounded-lg">
              <div className="absolute rounded-xl">
                {/* Close button */}
                <div className="modal-content">
                  {/* Render the form for the selected product */}
                  {renderProductForm()}
                </div>
              </div>
            </div>
          )}

          {/* Notification */}
          {notification && (
            <div className="absolute bottom-0 right-2 text-xl text-lime-600 bg-slate-100 p-4 rounded-xl">
              {notification}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerTable;
