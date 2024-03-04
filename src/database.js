import fs from 'node:fs/promises'

// {users: [...]}

const dataBasePath = new URL('../db.json', import.meta.url)

export class Database{
    #database = {}

    constructor(){
        fs.readFile(dataBasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(dataBasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select(table, search){
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter((row) => {
                return Object.entries(search).some(([key, value]) => {
                    console.log(row[key]);
                    return row[key].includes(value)
                })
            })
        }
        return data
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)


        if (rowIndex > -1){
            const existingData = this.#database[table][rowIndex];
            const newData = { ...existingData, ...data };
            newData.title = data.title ? data.title : existingData.title
            newData.description = data.description ? data.description : existingData.description
            newData.created_at = existingData.created_at;
            newData.completed_at = existingData.completed_at
            newData.updated_at = new Date();
            this.#database[table][rowIndex] = newData;
            this.#persist();
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    complete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1){
            this.#database[table][rowIndex].completed_at = new Date()
            this.#persist();
        }
    }
}