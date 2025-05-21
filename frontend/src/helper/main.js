// handling moving item in preview [quiz and exam creation and edit]
const moveItem = (index, direction, update) => {
  update((prevItems) => {
    const newItems = [...prevItems];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newItems.length) return prevItems;
    [newItems[index], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[index],
    ];
    return newItems;
  });
};

const deleteItem = (id, update) => {
  update((prevSet) => prevSet.filter((item) => item.id !== id));
}

export {moveItem, deleteItem};