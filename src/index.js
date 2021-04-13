document.addEventListener('DOMContentLoaded', () => {
    getQuotes()
    newQuoteInput()
})

const getQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes =>{
        console.log(quotes)
        quotes.forEach(quote =>{
            renderQuote(quote)
        })
    })
}

const renderQuote = (quote) => {
    const quoteList = document.getElementById('quote-list')

        const quoteCard = document.createElement('li')
            quoteCard.classList.add('quote-card')

            const blockQuote = document.createElement('blockquote')
                blockQuote.classList.add('blockquote')

                const quoteText = document.createElement('p')
                    quoteText.classList.add('mb-0')
                    quoteText.innerText = quote.quote

                    const footer = document.createElement('footer')
                        footer.classList.add('blockquote-footer')
                            footer.innerText = quote.author

                        const likeButton = document.createElement('button')
                            likeButton.className = 'btn btn-success'
                                likeButton.innerHTML = `${quote.likes.length} Likes`
                                    likeButton.addEventListener('click', (e) =>{
                                        e.preventDefault()
                                        createLikes(e, quote)
                                        console.log('Like sent to createLikes!')
                                    })

                            const deleteButton = document.createElement('button')
                                deleteButton.className = 'btn btn-danger'
                                    deleteButton.innerText = "Delete"
                                        deleteButton.addEventListener('click', (e) => {
                                            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                                                method: 'DELETE'
                                            })
                                            quoteCard.remove()
                                        })

                                const lineBreak = document.createElement('br')

                                    const editButton = document.createElement('button')
                                        editButton.className = 'btn btn-outline-dark'
                                        editButton.setAttribute('type', "button")
                                        editButton.setAttribute('data-bs-toggle', "collapse")
                                        editButton.setAttribute('data-bs-target', "#editQuote")
                                        editButton.setAttribute('aria-expanded', "false")
                                        editButton.setAttribute('aria-controls', "editQuote")
                                            editButton.innerText = "Edit Quote"
                                                editButton.addEventListener('click', () =>{
                                                    setupEditQuote(blockQuote, quote)
                                                })
                                                


    quoteList.append(quoteCard)
        quoteCard.append(blockQuote)
            blockQuote.append(quoteText, footer, likeButton, deleteButton, lineBreak, editButton)
}

const createLikes = (e, quote) => {

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id,
            createdAt: Date.now()
        })
    })
    .then(response => response.json())
    .then(newLike => {
        quote.likes.push(newLike)
        e.target.childNodes[0].data = `${quote.likes.length} Likes`
        // renderQuote(newLike)
    })
}

const newQuoteInput = () => {
    const newQuoteForm = document.getElementById('new-quote-form')
        newQuoteForm.addEventListener('submit', (e) => {
            e.preventDefault()
            createNewQuote(e)
        })
}

const createNewQuote = (e) => {

    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quote: e.target[0].value,
            author: e.target[1].value
        })
    })
    .then(response => response.json())
    .then(newQuote => {
        newQuote.likes = []
        renderQuote(newQuote)
    })
}

const setupEditQuote = (blockQuote, quote) => {

    const editDiv = document.createElement('div')

        const editForm = document.createElement('form')
            editForm.classList.add('new-quote-form')
            editForm.setAttribute('id', 'editQquote')

            const quoteFormGroup = document.createElement('div')
                quoteFormGroup.classList.add('form-group')

                const editQuoteLabel = document.createElement('label')
                    editQuoteLabel.setAttribute('for','new-quote')

                const editQuoteInput = document.createElement('input')
                    editQuoteInput.classList.add('form-control')
                    editQuoteInput.setAttribute('id', 'new-quote')
                    editQuoteInput.placeholder = quote.quote

            const authorFormGroup = document.createElement('div')
                authorFormGroup.classList.add('form-group')

                const editAuthorLabel = document.createElement('label')
                    editAuthorLabel.setAttribute('for', 'Author')

                const editAuthorInput = document.createElement('input')
                    editAuthorInput.classList.add('form-control')
                    editAuthorInput.setAttribute('id', 'author')
                    editAuthorInput.placeholder = quote.author

                const submitEditButton = document.createElement('button')
                    submitEditButton.classList.add('btn')
                    submitEditButton.innerText = "Submit"
                    

                    editForm.addEventListener('submit', (e) => {
                        e.preventDefault()
                        updateQuote(e, quote)
                        editForm.reset()
                        editForm.remove()
                    })

    blockQuote.append(editDiv)
        editDiv.append(editForm)
            editForm.append(quoteFormGroup, authorFormGroup)
                quoteFormGroup.append(editQuoteLabel, editQuoteInput)
                    authorFormGroup.append(editAuthorLabel, editAuthorInput, submitEditButton)
}

const updateQuote = (e, quote) => {
    e.preventDefault()

    const updatedQuoteLikes = quote.likes

        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                quote: e.target[0].value,
                author: e.target[1].value
            })
        })
        .then(response => response.json())
        .then(updatedQuote => {
            updatedQuote.likes = updatedQuoteLikes
            
            const quoteCard = document.querySelector('.mb-0')
                quoteCard.innerText = updatedQuote.quote

                const authorCard = document.querySelector('.blockquote-footer')
                authorCard.innerText = updatedQuote.author

        })

}