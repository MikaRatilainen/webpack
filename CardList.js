class CardList {
    constructor(list, initialCards) {
        this.element = list;
        this.render(initialCards);
    }

    render(initialCards) {
        initialCards.forEach(this.addCard, this);
    }

    addCard(cardProps) {
        const { element } = new Card(cardProps);

        this.element.appendChild(element);
    }
}
