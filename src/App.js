import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, 
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

const host = "http://search.prefixcommons.org/"
const searchkit = new SearchkitManager(host)

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://prefixcommons.org/?q=id:" + result._source.preferredPrefix
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://prefixcommons.org/?q=id:" + result._source.preferredPrefix
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank">
          <div className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title + " ["+ result._source.preferredPrefix + "]"}}>
            
            </div>
            <img alt="permalink" src="permalink-gray.png"/>
            </a>
        <h3 className={bemBlocks.item("subtitle")} dangerouslySetInnerHTML={{__html:source.description}}></h3>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
       <Layout>
        <TopBar>
          <div><img width="40" src="prefixcommons.png"/></div>
          <div>prefixcommons</div>
          <SearchBox 
              autofocus={true} 
              searchOnChange={true} 
              queryFields={['preferredPrefix^10', 'alternatePrefix^3', 'title^2', 'description^1', '_all^1']}
          />   
        </TopBar>
        <LayoutBody>
          <SideBar>
            <HierarchicalMenuFilter fields={["type"]} title="Type" id="categories"/>
            <RefinementListFilter id="keywords" title="Keywords" field="keywords" size={10}/>
            <InputFilter id="org" searchThrottleTime={500} 
              title="Organizations" 
              placeholder="Search organizations" 
              searchOnChange={true} 
              queryFields={["organization"]}
              blurAction="restore" />
            <RefinementListFilter id="organization" title="" field="organization" operator="OR" size={10}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

             <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Ascending", field:"preferredPrefix", order:"asc"},
                  {label:"Descending", field:"preferredPrefix", order:"desc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={7} 
                highlightFields={["preferredPrefix","title","description"]}
                hitComponents={[
                  {key:"list", title:"List", itemComponent:MovieHitsListItem, defaultOption:true},
                  {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
