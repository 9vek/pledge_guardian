use ic_cdk::{
    api::{time, caller},
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
};
use ic_cdk_macros::*;
use std::cell::RefCell;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct PledgeContent {
    pub display_name: String,
    pub description: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct Pledge {
    pub identity: Principal,
    pub time: String,
    pub description: String,
    pub display_name: String,
}

// data structures
type PledgeList = Vec<Pledge>;

// initialize memory pieces using RefCell
thread_local! {
    static PLEDGE_LIST: RefCell<PledgeList> = RefCell::default();
}

// update records
#[update]
fn update(pledge_content: PledgeContent) -> Pledge {
    let pledge = Pledge {
        identity: caller(),
        time: time().to_string(),
        display_name: pledge_content.display_name,
        description: pledge_content.description,
    };
    PLEDGE_LIST.with(|pledge_list| {
        let mut pledge_list = pledge_list.borrow_mut();
        pledge_list.push(pledge.clone());
        pledge_list.sort_by(|p1, p2| {p2.time.cmp(&p1.time)})
    });
    pledge
}

// get record related to current principal
#[query(name = "get_pledge_list")]
fn get_pledge_list(start: u64, size: u64) -> Vec<Pledge> {
    let start = start as usize;
    let mut size = size as usize;
    PLEDGE_LIST.with(|pledge_list| {
        let pledge_list = pledge_list.borrow();
        let limit = pledge_list.len();

        if limit == 0 || size == 0 { return vec![] }
        if start > limit { return vec![] }
        if start + size > limit { size = limit - start; }
        pledge_list[start..start+size].to_vec()
    })
}
