import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Search, SlidersHorizontal } from 'lucide-react'


interface FilterProps {
    setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>
    openFilter: boolean,
    setFilterValue: (value: string) => void
    filterQuery: {
        status: string, time: string, place: string, placeValue: string
    }
    placeValueChange: (value: React.ChangeEvent<HTMLInputElement>) => void
}


const Filter: React.FC<FilterProps> = ({ setOpenFilter, openFilter, setFilterValue, filterQuery, placeValueChange }) => {
    console.log(filterQuery)
    console.log(filterQuery.place.length > 0)
    return (
        <div className="space-y-2 mb-5">

            <div className=" grid place-content-end">

                <Button className=" " onClick={() => setOpenFilter(pre => !pre)} >
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>
            {openFilter && (<div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-12 gap-4">


                <div className='flex gap-3 sm:col-span-full  md:col-span-6'>
                    <Select onValueChange={setFilterValue}  >
                        <SelectTrigger className="" >
                            <SelectValue placeholder="Search By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="place:country">Country</SelectItem>
                            <SelectItem value="place:city">City</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-full">
                        <input
                            type="search"
                            // placeholder="Select search by..."
                            placeholder={
                                filterQuery?.place
                                    ? (filterQuery.place === "Country" ? "Type Country ..." : "Type City ...")
                                    : "Select search by first"
                            }
                            name="placeValue"
                            value={filterQuery.placeValue}
                            disabled={filterQuery?.place ? false : true}
                            onChange={placeValueChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full pl-10 p-2.5 outline-none placeholder:italic"
                        />
                        <Search className="absolute left-3 top-2 text-gray-400" />
                    </div>

                </div>


                <div className='sm:col-span-6 md:col-span-3'>

                    <Select onValueChange={setFilterValue}  >
                        <SelectTrigger className="" >
                            <SelectValue placeholder="Search By Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="status:Lost">Lost</SelectItem>
                            <SelectItem value="status:Found">Found</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <div className='sm:col-span-6 md:col-span-3'>

                    <Select onValueChange={setFilterValue} value="time:Latest" >
                        <SelectTrigger className="" >
                            <SelectValue placeholder="Search By Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="time:Latest">Latest</SelectItem>
                            <SelectItem value="time:Oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>



            </div>)}
        </div>
    )
}

export default Filter