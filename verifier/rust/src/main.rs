use sha2::{Digest,Sha256};
use std::fs;
use std::path::Path;

fn hash_file(p:&Path)->String{
    let data = fs::read(p).unwrap();
    let mut h = Sha256::new();
    h.update(data);
    format!("{:x}",h.finalize())
}

fn main(){

    let root="protocol-conformance/v2/bundles";

    let mut suites:Vec<_>=fs::read_dir(root)
        .unwrap()
        .map(|e|e.unwrap().file_name().into_string().unwrap())
        .collect();

    suites.sort();

    for s in suites{

        let dir=format!("{}/{}",root,s);

        let mut files:Vec<_>=fs::read_dir(&dir)
            .unwrap()
            .map(|e|e.unwrap().file_name().into_string().unwrap())
            .filter(|f|f.ends_with(".json"))
            .collect();

        files.sort();

        for f in files{

            let p=format!("{}/{}",dir,f);

            println!("{}/{} {}",s,f,hash_file(Path::new(&p)));
        }
    }
}
