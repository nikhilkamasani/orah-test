import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Filter } from "../../shared/models/filter"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [students, setStudents] = useState<Person[]>([])
  const [displayResults, setDisplayResults] = useState<Person[]>([])
  const [filter, setFilter] = useState<Filter>({
    first_name: "ASC",
    last_name: null,
    search: "",
    roll: null
  })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if(loadState === "loaded" && data?.students){
      setStudents(data.students)
      setDisplayResults(filterStudents(data.students))
    }
  }, [loadState])

  useEffect(() => {
    setDisplayResults(filterStudents(students))
  }, [filter, isRollMode])

  const onToolbarAction = (action: ToolbarAction, type: string, value: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if(action === "sort"){
      if(type === "search"){
        setFilter({...filter, search: value})
      } else if (type === "first"){
        setFilter({...filter, first_name: filter.first_name === "ASC" ? "DESC" : "ASC", last_name: null})
      } else if (type === "last"){
        setFilter({...filter, last_name: filter.last_name === "ASC" ? "DESC" : "ASC", first_name: null})
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const filterStudents = (list: Person[]) => {
    const { first_name, last_name, search, roll} = filter
    let filteredList = list;
    if(search){
      filteredList = filteredList.filter(a => PersonHelper.getFullName(a).toLowerCase().includes(search))
    }
    if(roll){
      filteredList = filteredList.filter(a => a.roll === roll)
    }
    if(first_name){
      filteredList.sort((a,b) => first_name === "ASC" ?
        a.first_name.localeCompare(b.first_name) : b.first_name.localeCompare(a.first_name))
    }
    if(last_name){
      filteredList.sort((a,b) => last_name === "ASC" ?
        a.last_name.localeCompare(b.last_name) : b.last_name.localeCompare(a.last_name))
    }
    return filteredList
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction}  filter={filter}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {loadState === "loaded" && (
          <>
            {displayResults.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, type?: any, value?: any) => void
  filter: Filter
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, filter } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort", "first")}>First Name&nbsp;
        {filter?.first_name && (filter.first_name === "ASC"
          ? <FontAwesomeIcon icon="sort-alpha-down" /> : <FontAwesomeIcon icon="sort-alpha-up" />)}
      </div>
      <div onClick={() => onItemClick("sort", "last")}>Last Name&nbsp;
        {filter?.last_name && (filter.last_name === "ASC"
          ? <FontAwesomeIcon icon="sort-alpha-down" /> : <FontAwesomeIcon icon="sort-alpha-up" />)}
      </div>
      <div>
        <input onChange={(e)=> onItemClick("sort", "search", e?.target?.value)} value={filter.search}/>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
