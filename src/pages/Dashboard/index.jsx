import { useState, useEffect } from "react";

import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { FoodsContainer } from "./styles";

import { api } from "../../services/api";

export function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const { data } = await api.get("/foods");
      setFoods(data);
    }

    getFoods();
  }, []);

  async function handleAddFood(food) {
    try {
      const { data } = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods((prevFoods) => [...prevFoods, data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateFood(food) {
    try {
      const { data } = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const updatedFoods = foods.map((food) =>
        food.id !== data.id ? food : data
      );

      setFoods(updatedFoods);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id) {
    await api.delete(`/foods/${id}`);

    const filteredFoods = foods.filter((food) => food.id !== id);

    setFoods(filteredFoods);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods?.map((food) => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}
